// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "./Crailo.sol";
import "./Validator.sol";
import "./Dispute.sol";


// ============ MAIN ESCROW CONTRACT ============
contract Escrow is Ownable {
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
    
    event ListingCreated(uint256 indexed listingId, address indexed seller, uint256 price);
    event BuyerCommitted(uint256 indexed listingId, address indexed buyer, uint256 amount);
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
        require(listings[listingId].status == ListingStatus.Active, "Listing not available");
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
        emit ListingCreated(listingCounter, msg.sender, price);
    }
    
    function commitToBuy(uint256 listingId) external payable onlyActiveListing(listingId) {
        Listing storage listing = listings[listingId];
        require(msg.sender != listing.seller, "Seller cannot buy own item");
        require(msg.value == listing.price, "Incorrect payment amount");
        
        listing.buyer = msg.sender;
        listing.status = ListingStatus.Committed;
        escrowBalances[msg.sender] += msg.value;
        
        emit BuyerCommitted(listingId, msg.sender, msg.value);
    }
    
    function cancelListing(uint256 listingId) external onlyListingSeller(listingId) {
        Listing storage listing = listings[listingId];
        require(listing.status == ListingStatus.Active, "Cannot cancel committed listing");
        
        uint256 slashAmount = listing.sellerStake;
        sellerStakes[msg.sender] -= slashAmount;
        listing.active = false;
        listing.status = ListingStatus.Cancelled;
        
        emit StakeSlashed(msg.sender, slashAmount, "Listing cancelled");
        emit ListingCancelled(listingId);
    }
    
    function confirmDelivery(uint256 listingId) external onlyListingBuyer(listingId) {
        Listing storage listing = listings[listingId];
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
    
    function createDispute(uint256 listingId, string memory reason) external onlyListingBuyer(listingId) {
        Listing storage listing = listings[listingId];
        require(listing.status == ListingStatus.Committed, "Invalid listing status");
        
        listing.status = ListingStatus.Disputed;
        
        disputeContract.createDispute(listingId, msg.sender, listing.seller, reason);
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
    
    function penalizeBuyer(uint256 listingId) external onlyOwner {
        Listing storage listing = listings[listingId];
        require(listing.status == ListingStatus.Completed, "Invalid status for penalty");
        
        uint256 penalty = (listing.price * buyerPenaltyPercent) / 100;
        if (escrowBalances[listing.buyer] >= penalty) {
            escrowBalances[listing.buyer] -= penalty;
            payable(owner()).transfer(penalty);
        }
    }
    
    function getListing(uint256 listingId) external view returns (
        uint256 id,
        address seller,
        string memory description,
        string memory imageHash,
        uint256 price,
        bool active,
        address buyer,
        ListingStatus status
    ) {
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
}