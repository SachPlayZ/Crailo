// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.28;

// import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";


// contract MyToken is ERC20, Ownable {
//     mapping(address => bool) public minters;
    
//     constructor(address initialOwner)
//         ERC20("MyToken", "MTK")
//         Ownable(initialOwner)
//     {}

//     function mint(address to, uint256 amount) public {
//         _mint(to, amount);
//     }
// }