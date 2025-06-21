// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Escrow is ERC20, Ownable(msg.sender) {
    uint256 public constant SELLER_STAKE_PERCENT = 10; // 10% stake requirement
    uint256 public constant BUYER_PENALTY_PERCENT = 5; // 5% penalty for backing out
    uint256 public constant VALIDATOR_REWARD = 100 * 10 ** 18; // 100 tokens per validation
    uint256 public constant DISPUTE_DURATION = 7 days;

    uint256 public listingCounter;
    uint256 public disputeCounter;

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

    struct Dispute {
        uint256 id;
        uint256 listingId;
        address buyer;
        address seller;
        string reason;
        uint256 createdAt;
        uint256 deadline;
        DisputeStatus status;
        uint256 yesVotes;
        uint256 noVotes;
        mapping(address => bool) hasVoted;
    }

    enum ListingStatus {
        Active, // Listed and available
        Committed, // Buyer committed, awaiting completion
        Completed, // Successfully completed
        Disputed, // Under dispute
        Cancelled // Cancelled by seller
    }

    enum DisputeStatus {
        Active,
        ResolvedYes, // Product matches description
        ResolvedNo // Product is fraudulent
    }

    // ============ MAPPINGS ============

    mapping(uint256 => Listing) public listings;
    mapping(uint256 => Dispute) public disputes;
    mapping(address => bool) public validators;
    mapping(address => uint256) public validatorStakes;
    mapping(address => uint256) public escrowBalances;
    mapping(address => uint256) public sellerStakes;

    // ============ EVENTS ============

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
    event DisputeCreated(
        uint256 indexed disputeId,
        uint256 indexed listingId,
        address indexed buyer
    );
    event DisputeResolved(uint256 indexed disputeId, bool productValid);
    event ValidatorAdded(address indexed validator);
    event ValidatorRemoved(address indexed validator);
    event StakeSlashed(address indexed user, uint256 amount, string reason);

    // ============ MODIFIERS ============

    modifier onlyValidator() {
        require(validators[msg.sender], "Not a validator");
        _;
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

    // ============ CONSTRUCTOR ============

    constructor() ERC20("CrailoToken", "CRAILO") {
        _mint(msg.sender, 1000000 * 10 ** 18); // Initial supply
    }

    // ============ LISTING FUNCTIONS ============

    function createListing(
        string memory description,
        string memory imageHash,
        uint256 price
    ) external payable {
        require(price > 0, "Price must be greater than 0");

        uint256 requiredStake = (price * SELLER_STAKE_PERCENT) / 100;
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

        // Slash seller's stake for cancellation
        uint256 slashAmount = listing.sellerStake;
        sellerStakes[msg.sender] -= slashAmount;
        listing.active = false;
        listing.status = ListingStatus.Cancelled;

        emit StakeSlashed(msg.sender, slashAmount, "Listing cancelled");
    }

    function confirmDelivery(
        uint256 listingId
    ) external onlyListingBuyer(listingId) {
        Listing storage listing = listings[listingId];
        require(
            listing.status == ListingStatus.Committed,
            "Invalid listing status"
        );

        // Transfer payment to seller
        uint256 payment = listing.price;
        escrowBalances[msg.sender] -= payment;

        // Return seller's stake
        uint256 stakeReturn = listing.sellerStake;
        sellerStakes[listing.seller] -= stakeReturn;

        listing.status = ListingStatus.Completed;
        listing.active = false;

        // Transfer funds
        payable(listing.seller).transfer(payment + stakeReturn);
    }

    // ============ DISPUTE FUNCTIONS ============

    function createDispute(
        uint256 listingId,
        string memory reason
    ) external onlyListingBuyer(listingId) {
        Listing storage listing = listings[listingId];
        require(
            listing.status == ListingStatus.Committed,
            "Invalid listing status"
        );

        disputeCounter++;

        Dispute storage dispute = disputes[disputeCounter];
        dispute.id = disputeCounter;
        dispute.listingId = listingId;
        dispute.buyer = msg.sender;
        dispute.seller = listing.seller;
        dispute.reason = reason;
        dispute.createdAt = block.timestamp;
        dispute.deadline = block.timestamp + DISPUTE_DURATION;
        dispute.status = DisputeStatus.Active;

        listing.status = ListingStatus.Disputed;

        emit DisputeCreated(disputeCounter, listingId, msg.sender);
    }

    function voteOnDispute(
        uint256 disputeId,
        bool productValid
    ) external onlyValidator {
        Dispute storage dispute = disputes[disputeId];
        require(dispute.status == DisputeStatus.Active, "Dispute not active");
        require(block.timestamp <= dispute.deadline, "Voting period ended");
        require(!dispute.hasVoted[msg.sender], "Already voted");

        dispute.hasVoted[msg.sender] = true;

        if (productValid) {
            dispute.yesVotes++;
        } else {
            dispute.noVotes++;
        }

        // Reward validator
        _mint(msg.sender, VALIDATOR_REWARD);

        // Auto-resolve if majority reached (assuming 5 validators minimum)
        if (dispute.yesVotes > 2 || dispute.noVotes > 2) {
            _resolveDispute(disputeId);
        }
    }

    function resolveDispute(uint256 disputeId) external {
        Dispute storage dispute = disputes[disputeId];
        require(dispute.status == DisputeStatus.Active, "Dispute not active");
        require(block.timestamp > dispute.deadline, "Voting period not ended");

        _resolveDispute(disputeId);
    }

    function _resolveDispute(uint256 disputeId) internal {
        Dispute storage dispute = disputes[disputeId];
        Listing storage listing = listings[dispute.listingId];

        bool productValid = dispute.yesVotes > dispute.noVotes;

        if (productValid) {
            // Product is valid - seller wins
            dispute.status = DisputeStatus.ResolvedYes;
            listing.status = ListingStatus.Completed;

            // Transfer payment to seller
            uint256 payment = listing.price;
            escrowBalances[dispute.buyer] -= payment;

            // Return seller's stake
            uint256 stakeReturn = listing.sellerStake;
            sellerStakes[dispute.seller] -= stakeReturn;

            payable(dispute.seller).transfer(payment + stakeReturn);
        } else {
            // Product is fraudulent - buyer wins
            dispute.status = DisputeStatus.ResolvedNo;
            listing.status = ListingStatus.Cancelled;

            // Refund buyer
            uint256 refund = listing.price;
            escrowBalances[dispute.buyer] -= refund;

            // Slash seller's stake
            uint256 slashAmount = listing.sellerStake;
            sellerStakes[dispute.seller] -= slashAmount;

            payable(dispute.buyer).transfer(refund);

            emit StakeSlashed(
                dispute.seller,
                slashAmount,
                "Fraudulent listing"
            );
        }

        listing.active = false;
        emit DisputeResolved(disputeId, productValid);
    }

    // ============ VALIDATOR FUNCTIONS ============

    function addValidator(address validator) external onlyOwner {
        validators[validator] = true;
        emit ValidatorAdded(validator);
    }

    function removeValidator(address validator) external onlyOwner {
        validators[validator] = false;
        emit ValidatorRemoved(validator);
    }

    function stakeAsValidator() external payable {
        require(
            msg.value >= 1000000000000000 wei,
            "Minimum 0.002 ETH stake required"
        );
        validatorStakes[msg.sender] += msg.value;
        validators[msg.sender] = true;
        emit ValidatorAdded(msg.sender);
    }

    function unstakeValidator() external {
        require(validators[msg.sender], "Not a validator");
        require(validatorStakes[msg.sender] > 0, "No stake to withdraw");

        uint256 stake = validatorStakes[msg.sender];
        validatorStakes[msg.sender] = 0;
        validators[msg.sender] = false;

        payable(msg.sender).transfer(stake);
        emit ValidatorRemoved(msg.sender);
    }

    // ============ BUYER PENALTY FUNCTIONS ============

    function penalizeBuyer(uint256 listingId) external onlyOwner {
        // Called when buyer backs out after validator confirms product is valid
        Listing storage listing = listings[listingId];
        require(
            listing.status == ListingStatus.Completed,
            "Invalid status for penalty"
        );

        uint256 penalty = (listing.price * BUYER_PENALTY_PERCENT) / 100;
        if (escrowBalances[listing.buyer] >= penalty) {
            escrowBalances[listing.buyer] -= penalty;
            // Penalty goes to protocol treasury (owner)
            payable(owner()).transfer(penalty);
        }
    }

    // ============ VIEW FUNCTIONS ============

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

    function getDispute(
        uint256 disputeId
    )
        external
        view
        returns (
            uint256 id,
            uint256 listingId,
            address buyer,
            address seller,
            string memory reason,
            DisputeStatus status,
            uint256 yesVotes,
            uint256 noVotes
        )
    {
        Dispute storage dispute = disputes[disputeId];
        return (
            dispute.id,
            dispute.listingId,
            dispute.buyer,
            dispute.seller,
            dispute.reason,
            dispute.status,
            dispute.yesVotes,
            dispute.noVotes
        );
    }
}
