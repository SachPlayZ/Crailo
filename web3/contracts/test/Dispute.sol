// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;
import "./MainEscrow.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// Token reward interface - using standard ERC20 mint function
interface IRewardToken {
    function mint(address to, uint256 amount) external;
}

// ============ MINIMAL DISPUTE CONTRACT WITH TOKEN REWARDS ============
contract DisputeContract {
    enum DisputeStatus {
        Active,
        ResolvedYes,
        ResolvedNo
    }
    
    struct Dispute {
        uint256 id;
        uint256 listingId;
        address buyer;
        address seller;
        string imageHash;
        string reason;
        uint256 createdAt;
        uint256 deadline;
        DisputeStatus status;
        uint256 yesVotes;
        uint256 noVotes;
        mapping(address => bool) hasVoted;
    }
 
    struct DisputeView {
        uint256 id;
        uint256 listingId;
        address buyer;
        address seller;
        string imageHash;
        string reason;
        uint256 createdAt;
        uint256 deadline;
        DisputeStatus status;
        uint256 yesVotes;
        uint256 noVotes;
    }
    
    uint256 public disputeDuration = 7 days;
    uint256 public requiredVotes = 3;
    uint256 public disputeCounter;
    uint256 public constant VOTE_REWARD = 20 * 10**18; // 20 tokens with 18 decimals
    
    mapping(uint256 => Dispute) public disputes;
    uint256[] public activeDisputes;
    
    MainEscrow public mainEscrow;
    IRewardToken public rewardToken;
    address public owner;

    event DisputeCreated(uint256 indexed disputeId, uint256 indexed listingId, address indexed buyer);
    event DisputeVoted(uint256 indexed disputeId, address indexed validator, bool vote);
    event DisputeResolved(uint256 indexed disputeId, bool productValid);
    event TokensRewarded(address indexed validator, uint256 amount);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }
    
    constructor() {
        owner = msg.sender;
    }
    
    function setMainEscrow(address _mainEscrow) external onlyOwner {
        mainEscrow = MainEscrow(_mainEscrow);
    }
    
    function setRewardToken(address _rewardToken) external onlyOwner {
        rewardToken = IRewardToken(_rewardToken);
    }
    
    function createDispute(
        uint256 listingId,
        address buyer,
        string memory imageHash,
        address seller,
        string memory reason
    ) external returns (uint256) {
        disputeCounter++;
        Dispute storage dispute = disputes[disputeCounter];
        dispute.id = disputeCounter;
        dispute.listingId = listingId;
        dispute.buyer = buyer;
        dispute.seller = seller;
        dispute.imageHash = imageHash;
        dispute.reason = reason;
        dispute.createdAt = block.timestamp;
        dispute.deadline = block.timestamp + disputeDuration;
        dispute.status = DisputeStatus.Active;
        
        activeDisputes.push(disputeCounter);
        
        emit DisputeCreated(disputeCounter, listingId, buyer);
        return disputeCounter;
    }
    
    function voteOnDispute(uint256 disputeId, bool productValid) external {
        require(mainEscrow.validators(msg.sender), "Not a validator");
        
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
        
        // Mint reward tokens to the validator
        if (address(rewardToken) != address(0)) {
            rewardToken.mint(msg.sender, VOTE_REWARD);
            emit TokensRewarded(msg.sender, VOTE_REWARD);
        }
        
        emit DisputeVoted(disputeId, msg.sender, productValid);
        
        // Auto-resolve if required votes reached
        if (dispute.yesVotes >= requiredVotes || dispute.noVotes >= requiredVotes) {
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
        bool productValid = dispute.yesVotes > dispute.noVotes;
        
        if (productValid) {
            dispute.status = DisputeStatus.ResolvedYes;
        } else {
            dispute.status = DisputeStatus.ResolvedNo;
        }
        
        // Remove from active disputes
        for (uint i = 0; i < activeDisputes.length; i++) {
            if (activeDisputes[i] == disputeId) {
                activeDisputes[i] = activeDisputes[activeDisputes.length - 1];
                activeDisputes.pop();
                break;
            }
        }
        
        // Call back to MainEscrow to distribute funds
        mainEscrow.resolveDisputeCallback(dispute.listingId, productValid);
        
        emit DisputeResolved(disputeId, productValid);
    }
    
    // Read functions
    function getActiveDisputes() external view returns (uint256[] memory) {
        return activeDisputes;
    }
    
    function getAllActiveDisputesDetails() external view returns (DisputeView[] memory) {
        DisputeView[] memory activeDisputesDetails = new DisputeView[](activeDisputes.length);
        
        for (uint256 i = 0; i < activeDisputes.length; i++) {
            uint256 disputeId = activeDisputes[i];
            Dispute storage dispute = disputes[disputeId];
            
            activeDisputesDetails[i] = DisputeView({
                id: dispute.id,
                listingId: dispute.listingId,
                buyer: dispute.buyer,
                seller: dispute.seller,
                imageHash: dispute.imageHash,
                reason: dispute.reason,
                createdAt: dispute.createdAt,
                deadline: dispute.deadline,
                status: dispute.status,
                yesVotes: dispute.yesVotes,
                noVotes: dispute.noVotes
            });
        }
        
        return activeDisputesDetails;
    }
    
    function getDispute(uint256 disputeId)
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
            uint256 noVotes,
            uint256 deadline
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
            dispute.noVotes,
            dispute.deadline
        );
    }
    
    function hasValidatorVoted(uint256 disputeId, address validator) external view returns (bool) {
        return disputes[disputeId].hasVoted[validator];
    }
    
    function updateDisputeDuration(uint256 _newDuration) external onlyOwner {
        disputeDuration = _newDuration;
    }
    
    function updateRequiredVotes(uint256 _newRequiredVotes) external onlyOwner {
        requiredVotes = _newRequiredVotes;
    }
    
    function updateVoteReward(uint256 _newReward) external onlyOwner {
        // This would require making VOTE_REWARD non-constant if you want it updatable
        // For now, it's fixed at 20 tokens
    }
}