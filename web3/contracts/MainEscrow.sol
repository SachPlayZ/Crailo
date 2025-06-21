// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "./Crailo.sol";
import "./Validator.sol";
import "./Dispute.sol";

// ============ MAIN ESCROW CONTRACT ============
contract MainEscrow is Ownable {
    struct Listing {
        uint256 id;
        address seller;
        string description;
        string imageHash;
        uint256 price;
        bool active;
        address buyer;
        uint256 sellerStake;
        ListingStatus status;
        uint256 createdAt;
    }

    enum ListingStatus {
        Active,
        Committed,
        Completed,
        Disputed,
        Cancelled
    }

    struct UserHistory {
        address user;
        uint256[] listingIds;
    }

    mapping(address => UserHistory) private userHistories;

    // Configuration constants - updatable
    uint256 public sellerStakePercent = 10; // 10%
    uint256 public buyerPenaltyPercent = 5; // 5%

    uint256 public listingCounter;
    mapping(uint256 => Listing) public listings;
    mapping(address => uint256) public escrowBalances;
    mapping(address => uint256) public sellerStakes;

    CrailoToken public immutable token;
    ValidatorContract public immutable validatorContract;
    DisputeContract public immutable disputeContract;

    event ListingCreated(
        uint256 indexed listingId,
        address indexed seller,
        uint256 price
    );
    event BuyerCommitted(
        uint256 indexed listingId,
        address indexed buyer,
        uint256 amount
    );
    event DeliveryConfirmed(uint256 indexed listingId);
    event ListingCancelled(uint256 indexed listingId);
    event StakeSlashed(address indexed user, uint256 amount, string reason);
    event ConfigUpdated(string indexed param, uint256 newValue);

    constructor(
        address _token,
        address _validatorContract,
        address _disputeContract
    ) Ownable(msg.sender) {
        token = CrailoToken(_token);
        validatorContract = ValidatorContract(_validatorContract);
        disputeContract = DisputeContract(_disputeContract);
    }

    modifier onlyActiveListing(uint256 listingId) {
        require(listings[listingId].active, "Listing not active");
        require(
            listings[listingId].status == ListingStatus.Active,
            "Listing not available"
        );
        _;
    }

    modifier onlyListingSeller(uint256 listingId) {
        require(listings[listingId].seller == msg.sender, "Not the seller");
        _;
    }

    modifier onlyListingBuyer(uint256 listingId) {
        require(listings[listingId].buyer == msg.sender, "Not the buyer");
        _;
    }

    function createListing(
        string memory description,
        string memory imageHash,
        uint256 price
    ) external payable {
        require(price > 0, "Price must be greater than 0");
        uint256 requiredStake = (price * sellerStakePercent) / 100;
        require(msg.value >= requiredStake, "Insufficient stake");

        listingCounter++;
        listings[listingCounter] = Listing({
            id: listingCounter,
            seller: msg.sender,
            description: description,
            imageHash: imageHash,
            price: price,
            active: true,
            buyer: address(0),
            sellerStake: msg.value,
            status: ListingStatus.Active,
            createdAt: block.timestamp
        });

        sellerStakes[msg.sender] += msg.value;
        userHistories[msg.sender].user = msg.sender;
        userHistories[msg.sender].listingIds.push(listingCounter);

        emit ListingCreated(listingCounter, msg.sender, price);
    }

    function commitToBuy(
        uint256 listingId
    ) external payable onlyActiveListing(listingId) {
        Listing storage listing = listings[listingId];
        require(msg.sender != listing.seller, "Seller cannot buy own item");
        require(msg.value == listing.price, "Incorrect payment amount");

        listing.buyer = msg.sender;
        listing.status = ListingStatus.Committed;
        escrowBalances[msg.sender] += msg.value;

        userHistories[msg.sender].user = msg.sender;
        userHistories[msg.sender].listingIds.push(listingId);

        emit BuyerCommitted(listingId, msg.sender, msg.value);
    }

    function cancelListing(
        uint256 listingId
    ) external onlyListingSeller(listingId) {
        Listing storage listing = listings[listingId];
        require(
            listing.status == ListingStatus.Active,
            "Cannot cancel committed listing"
        );

        uint256 slashAmount = (listing.sellerStake * 10) / 100;
        uint256 returnAmount = listing.sellerStake - slashAmount;

        // Deduct the full stake from seller's total stakes
        sellerStakes[msg.sender] -= listing.sellerStake;

        // Update listing status
        listing.active = false;
        listing.status = ListingStatus.Cancelled;

        // Return the remaining stake (90%) to the seller
        payable(msg.sender).transfer(returnAmount);

        emit StakeSlashed(msg.sender, slashAmount, "Listing cancelled");
        emit ListingCancelled(listingId);
    }

    function confirmDelivery(
        uint256 listingId
    ) external onlyListingBuyer(listingId) {
        Listing storage listing = listings[listingId];
        require(
            listing.status == ListingStatus.Committed,
            "Invalid listing status"
        );

        uint256 payment = listing.price;
        uint256 stakeReturn = listing.sellerStake;

        escrowBalances[msg.sender] -= payment;
        sellerStakes[listing.seller] -= stakeReturn;

        listing.status = ListingStatus.Completed;
        listing.active = false;

        payable(listing.seller).transfer(payment + stakeReturn);
        emit DeliveryConfirmed(listingId);
    }

    function createDispute(
        uint256 listingId,
        string memory reason
    ) external onlyListingBuyer(listingId) {
        Listing storage listing = listings[listingId];
        require(
            listing.status == ListingStatus.Committed,
            "Invalid listing status"
        );

        listing.status = ListingStatus.Disputed;

        disputeContract.createDispute(
            listingId,
            msg.sender,
            listing.seller,
            reason
        );
    }

    function resolveDisputeCallback(
        uint256 listingId,
        bool productValid
    ) external {
        require(
            msg.sender == address(disputeContract),
            "Only dispute contract"
        );

        Listing storage listing = listings[listingId];

        if (productValid) {
            // Seller wins
            uint256 payment = listing.price;
            uint256 stakeReturn = listing.sellerStake;

            escrowBalances[listing.buyer] -= payment;
            sellerStakes[listing.seller] -= stakeReturn;

            listing.status = ListingStatus.Completed;
            payable(listing.seller).transfer(payment + stakeReturn);
        } else {
            // Buyer wins
            uint256 refund = listing.price;
            uint256 slashAmount = listing.sellerStake;

            escrowBalances[listing.buyer] -= refund;
            sellerStakes[listing.seller] -= slashAmount;

            listing.status = ListingStatus.Cancelled;
            payable(listing.buyer).transfer(refund);

            emit StakeSlashed(
                listing.seller,
                slashAmount,
                "Fraudulent listing"
            );
        }

        listing.active = false;
    }

    function penalizeBuyer(uint256 listingId) external onlyOwner {
        Listing storage listing = listings[listingId];
        require(
            listing.status == ListingStatus.Completed,
            "Invalid status for penalty"
        );

        uint256 penalty = (listing.price * buyerPenaltyPercent) / 100;
        if (escrowBalances[listing.buyer] >= penalty) {
            escrowBalances[listing.buyer] -= penalty;
            payable(owner()).transfer(penalty);
        }
    }

    function getListing(
        uint256 listingId
    )
        external
        view
        returns (
            uint256 id,
            address seller,
            string memory description,
            string memory imageHash,
            uint256 price,
            bool active,
            address buyer,
            ListingStatus status
        )
    {
        Listing storage listing = listings[listingId];
        return (
            listing.id,
            listing.seller,
            listing.description,
            listing.imageHash,
            listing.price,
            listing.active,
            listing.buyer,
            listing.status
        );
    }

    /**
     * @dev Returns all listings as an array
     * @return Array of all listings with their complete information
     */
    function getListings() external view returns (Listing[] memory) {
        Listing[] memory allListings = new Listing[](listingCounter);

        for (uint256 i = 1; i <= listingCounter; i++) {
            allListings[i - 1] = listings[i];
        }

        return allListings;
    }

    /**
     * @dev Returns only active listings (status = Active)
     * @return Array of active listings
     */
    function getActiveListings() external view returns (Listing[] memory) {
        // First, count active listings
        uint256 activeCount = 0;
        for (uint256 i = 1; i <= listingCounter; i++) {
            if (
                listings[i].status == ListingStatus.Active && listings[i].active
            ) {
                activeCount++;
            }
        }

        // Create array with exact size
        Listing[] memory activeListings = new Listing[](activeCount);
        uint256 currentIndex = 0;

        // Fill the array
        for (uint256 i = 1; i <= listingCounter; i++) {
            if (
                listings[i].status == ListingStatus.Active && listings[i].active
            ) {
                activeListings[currentIndex] = listings[i];
                currentIndex++;
            }
        }

        return activeListings;
    }

    // Configuration update functions
    function updateSellerStakePercent(uint256 _newPercent) external onlyOwner {
        require(_newPercent <= 100, "Cannot exceed 100%");
        sellerStakePercent = _newPercent;
        emit ConfigUpdated("sellerStakePercent", _newPercent);
    }

    function updateBuyerPenaltyPercent(uint256 _newPercent) external onlyOwner {
        require(_newPercent <= 100, "Cannot exceed 100%");
        buyerPenaltyPercent = _newPercent;
        emit ConfigUpdated("buyerPenaltyPercent", _newPercent);
    }

    /**
     * @dev Returns the full listing history (Listing structs) for a particular address
     * @param user The address to query
     * @return Array of Listing structs associated with the user
     */
    function getUserHistory(
        address user
    ) external view returns (Listing[] memory) {
        uint256[] storage ids = userHistories[user].listingIds;
        Listing[] memory history = new Listing[](ids.length);
        for (uint256 i = 0; i < ids.length; i++) {
            history[i] = listings[ids[i]];
        }
        return history;
    }
}
