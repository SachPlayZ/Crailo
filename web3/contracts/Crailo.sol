// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// ============ TOKEN CONTRACT ============
contract CrailoToken is ERC20, Ownable {
    constructor() ERC20("CrailoToken", "CRAILO") Ownable(msg.sender) {
        _mint(msg.sender, 1000000 * 10 ** 18);
    }
    
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}