// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract TrustDrops is Ownable {
    uint public totalReputation;
    uint public seedFund;
    uint public totalAllocationLocked;
    uint public approvalAirdropAmount = 30 * 1e18;
    address public approver;

    struct Stake {
        uint amount;
    }

    struct Cred {
        uint amount;
    }

    struct Candidate {
        address[] stakers;
        mapping(address => bool) hasStaked;
    }

    mapping(address => Candidate) private candidates;
    mapping(address => mapping(address => Stake)) public stakes;
    mapping(address => uint) public totalStakedByUser;
    mapping(address => uint) public reputation;
    mapping(address => bool) public approvedAddress;
    mapping(bytes32 => bool) public approvedId;
    mapping(address => uint) public allocation;
    address[] public users;
    mapping(address => bool) public userAdded;

    event Staked(address indexed staker, address indexed candidate, uint amount, uint cred, uint timestamp);
    event Unstaked(address indexed staker, address indexed candidate, uint amount, uint cred, uint timestamp);
    event TokensClaimed(address indexed candidate, uint amount);

    constructor() Ownable(msg.sender) {
        approver = msg.sender;
    }

    function updateApprover(address _newApprover) external onlyOwner {
        approver = _newApprover;
    }

    function depositSeedFunds() external payable {
        seedFund += msg.value;
    }

    function updateAirdropAmount(uint _updatedAmount) onlyOwner() external {
        approvalAirdropAmount = _updatedAmount;
    }

    function approve(address _user, bytes32 _id) external {
        require(msg.sender == approver, "TrustDrops::Not authorised");
        require(approvedAddress[_user] == false, "TrustDrops::Address already approved");
        require(approvedId[_id] == false, "TrustDrops::Id already approved");
        approvedAddress[_user] = true;
        approvedId[_id] = true;
        (bool sent, ) = (_user).call{value: approvalAirdropAmount}("");
        seedFund -= approvalAirdropAmount;
        require(sent, "TrustDrops::Failed to send Ether");
    }

    function stake(address candidate) payable external {
        require(approvedAddress[msg.sender], "Link your wallet with twitter to stake");
        uint amount = msg.value;
        require(amount > 0, "TrustDrops::Amount must be positive");

        if (!userAdded[candidate]) {
            users.push(candidate);
            userAdded[candidate] = true;
        }

        if (!candidates[candidate].hasStaked[msg.sender]) {
            candidates[candidate].stakers.push(msg.sender);
            candidates[candidate].hasStaked[msg.sender] = true;
        }

        uint oldTotalReputation = calculateReputation(stakes[msg.sender][candidate].amount);
        stakes[msg.sender][candidate].amount += amount;
        totalStakedByUser[msg.sender] += amount;
        uint newTotalReputation = calculateReputation(stakes[msg.sender][candidate].amount);
        reputation[candidate] = reputation[candidate] - oldTotalReputation + newTotalReputation;
        totalReputation = totalReputation + newTotalReputation - oldTotalReputation;

        emit Staked(msg.sender, candidate, amount, newTotalReputation - oldTotalReputation, block.timestamp);
    }

    function calculateReputation(uint x) internal pure returns (uint) {
        if (x == 0) return 0;
        uint z = (x + 1) / 2;
        uint y = x;
        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        }
        return y/1e9;
    }


    function claimTokens() external {
        require(allocation[msg.sender] > 0, "No reward allocation");
        uint reward = allocation[msg.sender];
        allocation[msg.sender] = 0;
        (bool sent, ) = (msg.sender).call{value: reward}("");
        totalAllocationLocked -= reward;
        require(sent, "TrustDrops::Failed to send Ether");

        emit TokensClaimed(msg.sender, reward);
    }

    function unstake(address candidate, uint amount) external {
        require(amount > 0, "TrustDrops::Amount must be positive");
        Stake storage _stake = stakes[msg.sender][candidate];
        require(_stake.amount >= amount, "TrustDrops::Insufficient staked amount");

        uint oldTotalReputation = calculateReputation(stakes[msg.sender][candidate].amount);
        _stake.amount -= amount;
        totalStakedByUser[msg.sender] -= amount;
        uint newTotalReputation = calculateReputation(stakes[msg.sender][candidate].amount);
        reputation[candidate] = reputation[candidate] + newTotalReputation - oldTotalReputation;
        totalReputation = totalReputation + newTotalReputation - oldTotalReputation;

        (bool sent, ) = (msg.sender).call{value: amount}("");
        require(sent, "TrustDrops::Failed to send Ether");

        emit Unstaked(msg.sender, candidate, amount, oldTotalReputation - newTotalReputation, block.timestamp);
    }

    receive() external payable {
        // This function is executed when a contract receives plain Ether (without data)
        for (uint i=0; i<users.length; i++) {
            uint allocatedFund = msg.value * reputation[users[i]] / totalReputation;
            allocation[users[i]] += allocatedFund;
            totalAllocationLocked += allocatedFund;
        }
    }
}
