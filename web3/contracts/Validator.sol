// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Crailo.sol";

// ============ VALIDATOR CONTRACT ============
contract ValidatorContract is Ownable {
    struct Validator {
        uint256 initialStake;
        uint256 currentStake;
        uint256 repEarned;
        uint256 numberOfValidations;
        uint256 lastValidatedAt;
        bool isActive;
    }

    // Configuration constants - updatable
    uint256 public minValidatorStake = 1 wei;
    uint256 public validatorReward = 100 * 10 ** 18;

    mapping(address => Validator) public validators;
    address[] public validatorList;

    CrailoToken public immutable token;

    event ValidatorAdded(address indexed validator, uint256 stake);
    event ValidatorRemoved(address indexed validator);
    event ValidatorRewarded(address indexed validator, uint256 reward);
    event ConfigUpdated(string indexed param, uint256 newValue);

    constructor(address _token) Ownable(msg.sender) {
        token = CrailoToken(_token);
    }

    modifier onlyActiveValidator() {
        require(validators[msg.sender].isActive, "Not an active validator");
        _;
    }

    function stakeAsValidator() external payable {
        require(msg.value >= minValidatorStake, "Insufficient stake");

        Validator storage validator = validators[msg.sender];

        if (!validator.isActive) {
            validator.initialStake = msg.value;
            validator.currentStake = msg.value;
            validator.isActive = true;
            validatorList.push(msg.sender);
            emit ValidatorAdded(msg.sender, msg.value);
        } else {
            validator.currentStake += msg.value;
        }
    }

    function unstakeValidator() external onlyActiveValidator {
        Validator storage validator = validators[msg.sender];
        uint256 stake = validator.currentStake;

        validator.currentStake = 0;
        validator.isActive = false;

        // Remove from validator list
        for (uint i = 0; i < validatorList.length; i++) {
            if (validatorList[i] == msg.sender) {
                validatorList[i] = validatorList[validatorList.length - 1];
                validatorList.pop();
                break;
            }
        }

        payable(msg.sender).transfer(stake);
        emit ValidatorRemoved(msg.sender);
    }

    function rewardValidator(address validator) external onlyOwner {
        require(validators[validator].isActive, "Validator not active");

        Validator storage val = validators[validator];
        val.repEarned += validatorReward;
        val.numberOfValidations++;
        val.lastValidatedAt = block.timestamp;

        token.mint(validator, validatorReward);
        emit ValidatorRewarded(validator, validatorReward);
    }

    function addValidator(address validator) external onlyOwner {
        validators[validator].isActive = true;
        validatorList.push(validator);
        emit ValidatorAdded(validator, 0);
    }

    function removeValidator(address validator) external onlyOwner {
        validators[validator].isActive = false;

        // Remove from validator list
        for (uint i = 0; i < validatorList.length; i++) {
            if (validatorList[i] == validator) {
                validatorList[i] = validatorList[validatorList.length - 1];
                validatorList.pop();
                break;
            }
        }

        emit ValidatorRemoved(validator);
    }

    function isValidator(address addr) external view returns (bool) {
        return validators[addr].isActive;
    }

    function getActiveValidators() external view returns (address[] memory) {
        return validatorList;
    }

    function getValidatorInfo(
        address validator
    )
        external
        view
        returns (
            uint256 initialStake,
            uint256 currentStake,
            uint256 repEarned,
            uint256 numberOfValidations,
            uint256 lastValidatedAt,
            bool isActive
        )
    {
        Validator storage val = validators[validator];
        return (
            val.initialStake,
            val.currentStake,
            val.repEarned,
            val.numberOfValidations,
            val.lastValidatedAt,
            val.isActive
        );
    }

    // Configuration update functions
    function updateMinValidatorStake(uint256 _newStake) external onlyOwner {
        minValidatorStake = _newStake;
        emit ConfigUpdated("minValidatorStake", _newStake);
    }

    function updateValidatorReward(uint256 _newReward) external onlyOwner {
        validatorReward = _newReward;
        emit ConfigUpdated("validatorReward", _newReward);
    }
}
