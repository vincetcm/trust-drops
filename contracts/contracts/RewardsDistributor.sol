// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/access/Ownable.sol";

interface IRewardDistributor {
    function allocation(address _address) external returns (uint);
}

contract RewardsDistributor is Ownable {
    IRewardDistributor public distributorv1 = IRewardDistributor(0xe1E4c0562780A0b7ecF9231697FB883205c6A977);
    mapping(address => uint) public allocation;
    bool public allocateOldRewards;

    struct AllocateParams {
        address userAddress;
        uint256 allo;
    }

    constructor(address _owner) Ownable(_owner) {
        allocateOldRewards = true;
    }

    function disableOldRewards() external onlyOwner {
        allocateOldRewards = false;
    }

    function allocate(AllocateParams[] memory _allocations) external onlyOwner {
        for (uint i=0; i<_allocations.length; i++) {
            if (_allocations[i].userAddress == address(0)) {
                continue;
            }
            allocation[_allocations[i].userAddress] += _allocations[i].allo;
            if (allocateOldRewards) {
                allocation[_allocations[i].userAddress] += distributorv1.allocation(_allocations[i].userAddress);
            }
        }
    }

    function claimTokens() external {
        require(allocation[msg.sender] > 0, "No reward allocation");
        uint reward = allocation[msg.sender];
        allocation[msg.sender] = 0;
        (bool sent, ) = (msg.sender).call{value: reward}("");
        require(sent, "RewardsDistributor::Failed to send Ether");
    }

    receive() external payable {}
}
