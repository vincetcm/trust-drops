// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/access/Ownable.sol";

contract RewardsDistributor is Ownable {
    uint256 totalAllocationLocked;
    mapping(address => uint) public allocation;

    struct AllocateParams {
        address userAddress;
        uint256 share;
    }

    constructor(address _owner) Ownable(_owner) {}

    function allocate(AllocateParams[] memory _allocations) external onlyOwner {
        uint fundsToAllocate = address(this).balance - totalAllocationLocked;
        require(fundsToAllocate >= 0, "No funds to allocate!");
        for (uint i=0; i<_allocations.length; i++) {
            if (_allocations[i].userAddress == address(0) || _allocations[i].share == 0) {
                continue;
            }
            uint allocatedFund = (fundsToAllocate * _allocations[i].share) / 1e18;
            allocation[_allocations[i].userAddress] += allocatedFund;
            totalAllocationLocked += allocatedFund;
        }
    }

    function claimTokens() external {
        require(allocation[msg.sender] > 0, "No reward allocation");
        uint reward = allocation[msg.sender];
        allocation[msg.sender] = 0;
        totalAllocationLocked -= reward;
        (bool sent, ) = (msg.sender).call{value: reward}("");
        require(sent, "RewardsDistributor::Failed to send Ether");
    }
}
