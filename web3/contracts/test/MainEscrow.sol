// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./Dispute.sol";

// ============ MINIMAL ESCROW CONTRACT ============
contract MainEscrow {
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
    mapping(address => bool) public validators; // Simple validator mapping

    // Configuration constants
    uint256 public sellerStakePercent = 10; // 10%
    uint256 public buyerPenaltyPercent = 5; // 5%
    uint256 public listingCounter;
    mapping(uint256 => Listing) public listings;
    mapping(address => uint256) public escrowBalances;
    mapping(address => uint256) public sellerStakes;

    DisputeContract public disputeContract;
    address public owner;

    event ListingCreated(uint256 indexed listingId, address indexed seller, uint256 price);
    event BuyerCommitted(uint256 indexed listingId, address indexed buyer, uint256 amount);
    event DeliveryConfirmed(uint256 indexed listingId);
    event ListingCancelled(uint256 indexed listingId);
    event StakeSlashed(address indexed user, uint256 amount, string reason);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
        validators[msg.sender] = true; // Owner is default validator
    }

    function setDisputeContract(address _disputeContract) external onlyOwner {
        disputeContract = DisputeContract(_disputeContract);
    }

    function addValidator(address _validator) external onlyOwner {
        validators[_validator] = true;
    }

    function removeValidator(address _validator) external onlyOwner {
        validators[_validator] = false;
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

    function commitToBuy(uint256 listingId) external payable {
        Listing storage listing = listings[listingId];
        require(listing.active, "Listing not active");
        require(listing.status == ListingStatus.Active, "Listing not available");
        require(msg.sender != listing.seller, "Seller cannot buy own item");
        require(msg.value == listing.price, "Incorrect payment amount");

        listing.buyer = msg.sender;
        listing.status = ListingStatus.Committed;
        escrowBalances[msg.sender] += msg.value;

        userHistories[msg.sender].user = msg.sender;
        userHistories[msg.sender].listingIds.push(listingId);

        emit BuyerCommitted(listingId, msg.sender, msg.value);
    }

    function cancelListing(uint256 listingId) external {
        Listing storage listing = listings[listingId];
        require(listing.seller == msg.sender, "Not the seller");
        require(listing.status == ListingStatus.Active, "Cannot cancel committed listing");

        uint256 slashAmount = (listing.sellerStake * 10) / 100;
        uint256 returnAmount = listing.sellerStake - slashAmount;

        sellerStakes[msg.sender] -= listing.sellerStake;
        listing.active = false;
        listing.status = ListingStatus.Cancelled;

        payable(msg.sender).transfer(returnAmount);

        emit StakeSlashed(msg.sender, slashAmount, "Listing cancelled");
        emit ListingCancelled(listingId);
    }

    function confirmDelivery(uint256 listingId) external {
        Listing storage listing = listings[listingId];
        require(listing.buyer == msg.sender, "Not the buyer");
        require(listing.status == ListingStatus.Committed, "Invalid listing status");

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
        string memory imageHash,
        string memory reason
    ) external {
        Listing storage listing = listings[listingId];
        require(listing.buyer == msg.sender, "Not the buyer");
        require(listing.status == ListingStatus.Committed, "Invalid listing status");

        listing.status = ListingStatus.Disputed;

        disputeContract.createDispute(
            listingId,
            msg.sender,
            imageHash,
            listing.seller,
            reason
        );
    }

    function resolveDisputeCallback(uint256 listingId, bool productValid) external {
        require(msg.sender == address(disputeContract), "Only dispute contract");
        
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

            emit StakeSlashed(listing.seller, slashAmount, "Fraudulent listing");
        }

        listing.active = false;
    }

    // Read functions
    function getListing(uint256 listingId)
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

    function getListings() external view returns (Listing[] memory) {
        Listing[] memory allListings = new Listing[](listingCounter);
        for (uint256 i = 1; i <= listingCounter; i++) {
            allListings[i - 1] = listings[i];
        }
        return allListings;
    }

    function getActiveListings() external view returns (Listing[] memory) {
        uint256 activeCount = 0;
        for (uint256 i = 1; i <= listingCounter; i++) {
            if (listings[i].status == ListingStatus.Active && listings[i].active) {
                activeCount++;
            }
        }

        Listing[] memory activeListings = new Listing[](activeCount);
        uint256 currentIndex = 0;

        for (uint256 i = 1; i <= listingCounter; i++) {
            if (listings[i].status == ListingStatus.Active && listings[i].active) {
                activeListings[currentIndex] = listings[i];
                currentIndex++;
            }
        }

        return activeListings;
    }

    function getUserHistory(address user) external view returns (Listing[] memory) {
        uint256[] storage ids = userHistories[user].listingIds;
        Listing[] memory history = new Listing[](ids.length);
        for (uint256 i = 0; i < ids.length; i++) {
            history[i] = listings[ids[i]];
        }
        return history;
    }

    function getSellerHistory(address seller) external view returns (Listing[] memory) {
        uint256 count = 0;
        for (uint256 i = 1; i <= listingCounter; i++) {
            if (listings[i].seller == seller) {
                count++;
            }
        }

        Listing[] memory sellerListings = new Listing[](count);
        uint256 idx = 0;

        for (uint256 i = 1; i <= listingCounter; i++) {
            if (listings[i].seller == seller) {
                sellerListings[idx] = listings[i];
                idx++;
            }
        }

        return sellerListings;
    }
}
