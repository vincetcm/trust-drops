// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract TrustDrops is Ownable {
    uint public totalReputation;
    uint public seedFund;
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

    struct RewardDetails {
        uint lastUpdatedWeek;
        uint lastWeeklyTotalCred;
        mapping(uint => uint) weeklyTotalCred;
        mapping(uint => uint) weeklyTotalRewards;
        mapping(address => uint) userLastUpdatedWeek;
        mapping(address => uint) userLastClaimed;
        mapping(address => uint) lastUserCred;
        mapping(address => mapping(uint => uint)) userWeeklyCred;
    }

    RewardDetails public rewardDetails;
    mapping(address => Candidate) private candidates;
    mapping(address => mapping(address => Stake)) public stakes;
    mapping(address => uint) public totalStakedByUser;
    mapping(address => uint) public reputation;
    mapping(address => bool) public approvedAddress;
    mapping(bytes32 => bool) public approvedId;
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

        // Update reward details
        uint currentWeek = block.timestamp / 1 weeks;
        rewardDetails.weeklyTotalCred[currentWeek] += newTotalReputation - oldTotalReputation;
        rewardDetails.userWeeklyCred[msg.sender][currentWeek] += newTotalReputation - oldTotalReputation;
        rewardDetails.lastUpdatedWeek = currentWeek;
        rewardDetails.userLastUpdatedWeek[msg.sender] = currentWeek;
        rewardDetails.lastWeeklyTotalCred = rewardDetails.weeklyTotalCred[currentWeek];
        rewardDetails.lastUserCred[msg.sender] = rewardDetails.userWeeklyCred[msg.sender][currentWeek];

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

    function allocation(address _user) external view returns(uint) {
        return _calculateAllocation(_user);
    }

    function _calculateAllocation(address _user) internal view returns(uint) {
        uint currentWeek = block.timestamp / 1 weeks;
        uint userLastClaimed = rewardDetails.userLastClaimed[_user];
        
        uint totalReward = 0;
        
        for (uint week = userLastClaimed + 1; week <= currentWeek; week++) {
            uint userCred = rewardDetails.userWeeklyCred[_user][week];
            uint weekTotalCred = rewardDetails.weeklyTotalCred[week];
            uint weekTotalRewards = rewardDetails.weeklyTotalRewards[week];
            
            // Use fallback values if there is no data for the current week
            if (userCred == 0) {
                userCred = rewardDetails.lastUserCred[_user];
            }
            if (weekTotalCred == 0) {
                weekTotalCred = rewardDetails.lastWeeklyTotalCred;
            }
            
            if (weekTotalCred > 0) {
                uint userWeekReward = (weekTotalRewards * userCred) / weekTotalCred;
                totalReward += userWeekReward;
            }
        }
        
        return totalReward;
    }

    function claimTokens() external {
        uint currentWeek = block.timestamp / 1 weeks;
        uint alloc = _calculateAllocation(msg.sender);
        
        require(alloc > 0, "No reward allocation");

        // Update the weeklyTotalCred for weeks that haven't been updated
        for (uint week = rewardDetails.lastUpdatedWeek + 1; week <= currentWeek; week++) {
            if (rewardDetails.weeklyTotalCred[week] == 0) {
                rewardDetails.weeklyTotalCred[week] = rewardDetails.lastWeeklyTotalCred;
            }
        }
        rewardDetails.lastUpdatedWeek = currentWeek;
        rewardDetails.lastWeeklyTotalCred = rewardDetails.weeklyTotalCred[currentWeek];

        // Update the userWeeklyCred for weeks that haven't been updated
        for (uint week = rewardDetails.userLastUpdatedWeek[msg.sender] + 1; week <= currentWeek; week++) {
            if (rewardDetails.userWeeklyCred[msg.sender][week] == 0) {
                rewardDetails.userWeeklyCred[msg.sender][week] = rewardDetails.lastUserCred[msg.sender];
            }
        }
        rewardDetails.userLastUpdatedWeek[msg.sender] = currentWeek;
        rewardDetails.lastUserCred[msg.sender] = rewardDetails.userWeeklyCred[msg.sender][currentWeek];

        rewardDetails.userLastClaimed[msg.sender] = currentWeek;
        
        // Transfer the allocated tokens to the user
        (bool sent, ) = msg.sender.call{value: alloc}("");
        require(sent, "TrustDrops::Failed to send Ether");
        
        emit TokensClaimed(msg.sender, alloc);
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

        // Update rewards details
        uint currentWeek = block.timestamp / 1 weeks;
        rewardDetails.weeklyTotalCred[currentWeek] -= oldTotalReputation - newTotalReputation;
        rewardDetails.userWeeklyCred[msg.sender][currentWeek] -= oldTotalReputation - newTotalReputation;
        rewardDetails.lastUpdatedWeek = currentWeek;
        rewardDetails.userLastUpdatedWeek[msg.sender] = currentWeek;
        rewardDetails.lastWeeklyTotalCred = rewardDetails.weeklyTotalCred[currentWeek];
        rewardDetails.lastUserCred[msg.sender] = rewardDetails.userWeeklyCred[msg.sender][currentWeek];

        (bool sent, ) = (msg.sender).call{value: amount}("");
        require(sent, "TrustDrops::Failed to send Ether");

        emit Unstaked(msg.sender, candidate, amount, oldTotalReputation - newTotalReputation, block.timestamp);
    }

    receive() external payable {}
}
