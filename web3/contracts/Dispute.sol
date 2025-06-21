// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Validator.sol";
import "./MainEscrow.sol";

// ============ DISPUTE CONTRACT ============
contract DisputeContract is Ownable {
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

    enum DisputeStatus {
        Active,
        ResolvedYes, // Product matches description
        ResolvedNo // Product is fraudulent
    }

    // Configuration constants - updatable
    uint256 public disputeDuration = 7 days;
    uint256 public requiredVotes = 3; // Minimum votes to resolve

    uint256 public disputeCounter;
    mapping(uint256 => Dispute) public disputes;
    uint256[] public activeDisputes;

    ValidatorContract public immutable validatorContract;

    event DisputeCreated(
        uint256 indexed disputeId,
        uint256 indexed listingId,
        address indexed buyer
    );
    event DisputeVoted(
        uint256 indexed disputeId,
        address indexed validator,
        bool vote
    );
    event DisputeResolved(uint256 indexed disputeId, bool productValid);
    event ConfigUpdated(string indexed param, uint256 newValue);

    constructor(address _validatorContract) Ownable(msg.sender) {
        validatorContract = ValidatorContract(_validatorContract);
    }

    modifier onlyValidator() {
        require(validatorContract.isValidator(msg.sender), "Not a validator");
        _;
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
        validatorContract.rewardValidator(msg.sender);

        emit DisputeVoted(disputeId, msg.sender, productValid);

        // Auto-resolve if required votes reached
        if (
            dispute.yesVotes >= requiredVotes ||
            dispute.noVotes >= requiredVotes
        ) {
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

        emit DisputeResolved(disputeId, productValid);
    }

    function getActiveDisputes() external view returns (uint256[] memory) {
        return activeDisputes;
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

    function hasValidatorVoted(
        uint256 disputeId,
        address validator
    ) external view returns (bool) {
        return disputes[disputeId].hasVoted[validator];
    }

    // Configuration update functions
    function updateDisputeDuration(uint256 _newDuration) external onlyOwner {
        disputeDuration = _newDuration;
        emit ConfigUpdated("disputeDuration", _newDuration);
    }

    function updateRequiredVotes(uint256 _newRequiredVotes) external onlyOwner {
        requiredVotes = _newRequiredVotes;
        emit ConfigUpdated("requiredVotes", _newRequiredVotes);
    }
}
