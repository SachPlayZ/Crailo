// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ProductVoting {
    struct ProductStatus {
        uint256 yesVotes;
        uint256 noVotes;
        bool resolved;
    }

    mapping(uint256 => ProductStatus) public productStatus;
    mapping(uint256 => mapping(address => bool)) public hasVoted;

    event VotedYes(uint256 productId, uint256 totalYesVotes);
    event VotedNo(uint256 productId, uint256 totalNoVotes);
    event ProductResolved(uint256 productId);

    function voteYes(uint256 productId) external {
        require(!hasVoted[productId][msg.sender], "Already voted for this product");
        require(!productStatus[productId].resolved, "Product already resolved");

        hasVoted[productId][msg.sender] = true;
        productStatus[productId].yesVotes++;

        emit VotedYes(productId, productStatus[productId].yesVotes);

        if (productStatus[productId].yesVotes >= 3) {
            productStatus[productId].resolved = true;
            emit ProductResolved(productId);
        }
    }

    function voteNo(uint256 productId) external {
        require(!hasVoted[productId][msg.sender], "Already voted for this product");
        require(!productStatus[productId].resolved, "Product already resolved");

        hasVoted[productId][msg.sender] = true;
        productStatus[productId].noVotes++;

        emit VotedNo(productId, productStatus[productId].noVotes);

        if (productStatus[productId].noVotes >= 3) {
            productStatus[productId].resolved = true;
            emit ProductResolved(productId);
        }
    }

    function getProductStatus(uint256 productId) external view returns (uint256 yesVotes, uint256 noVotes, bool resolved) {
        ProductStatus memory status = productStatus[productId];
        return (status.yesVotes, status.noVotes, status.resolved);
    }
}
