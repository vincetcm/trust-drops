// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IAnonAadhaarVerifier.sol";
import "hardhat/console.sol";

contract TrustDrops is Ownable {
    IERC20 public mandToken;
    address public anonAadhaarVerifierAddr;
    uint public totalReputation;
    uint public constant DISTRIBUTION_INTERVAL = 5 minutes;
    uint public constant DISTRIBUTION_DENOMINATOR = 200;
    uint public constant LOGIN_AIRDROP_AMOUNT = 100 * 1e18;

    struct Stake {
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
    mapping(address => uint) public lastClaimTime;
    mapping(uint256 => bool) public alreadyVerified;
    mapping(address => bool) public alreadyLoggedIn;

    event Staked(address indexed staker, address indexed candidate, uint amount, uint cred);
    event Unstaked(address indexed staker, address indexed candidate, uint amount);
    event TokensClaimed(address indexed candidate, uint amount);

    constructor(address _mandTokenAddress, address _anonAadhaarVerifierAddr) Ownable(msg.sender) {
        mandToken = IERC20(_mandTokenAddress);
        anonAadhaarVerifierAddr = _anonAadhaarVerifierAddr;
    }

    function verifyAadhaar(uint256[2] calldata _pA, uint[2][2] calldata _pB, uint[2] calldata _pC, uint[34] calldata _pubSignals) external {
        require(alreadyVerified[_pubSignals[0]] == false, "Aadhaar already verified");
        bool valid = IAnonAadhaarVerifier(anonAadhaarVerifierAddr).verifyProof(_pA, _pB, _pC, _pubSignals);
        if (valid) {
            alreadyVerified[_pubSignals[0]] = true;
            alreadyLoggedIn[msg.sender] = true;
            mandToken.transfer(msg.sender, LOGIN_AIRDROP_AMOUNT);
        } else {
            revert("Invalid aadhaar proof");
        }
    }

    function stake(address candidate, uint amount) external {
        require(amount > 0, "Amount must be positive");
        mandToken.transferFrom(msg.sender, address(this), amount);

        if (!candidates[candidate].hasStaked[msg.sender]) {
            candidates[candidate].stakers.push(msg.sender);
            candidates[candidate].hasStaked[msg.sender] = true;
        }

        totalReputation -= calculateReputation(stakes[msg.sender][candidate].amount);
        uint oldTotalReputation = calculateReputation(stakes[msg.sender][candidate].amount);
        stakes[msg.sender][candidate].amount += amount;
        totalStakedByUser[msg.sender] += amount;
        updateReputation(msg.sender, candidate);
        uint newTotalReputation = calculateReputation(stakes[msg.sender][candidate].amount);
        totalReputation = totalReputation + newTotalReputation - oldTotalReputation;


        emit Staked(msg.sender, candidate, amount, newTotalReputation - oldTotalReputation);
    }

    function updateReputation(address staker, address candidate) internal {
        Stake storage _stake = stakes[staker][candidate];
        reputation[candidate] = calculateReputation(_stake.amount);
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

    function calculateIndividualAllocation(address candidate) public view returns (uint) {
        if (block.timestamp >= lastClaimTime[msg.sender] + DISTRIBUTION_INTERVAL) {
            uint totalTokens = mandToken.balanceOf(address(this));
            uint tokensForDistribution = totalTokens / DISTRIBUTION_DENOMINATOR;
            uint candidateReputation = reputation[candidate];
            uint candidateAllocation = tokensForDistribution * candidateReputation / totalReputation;

            return candidateAllocation;
        }
        return 0;
    }

    function claimTokens() external {
        require(block.timestamp >= lastClaimTime[msg.sender] + DISTRIBUTION_INTERVAL, "Already claimed for the latest distribution");

        uint tokensToDistribute = calculateIndividualAllocation(msg.sender);
        require(tokensToDistribute > 0, "No tokens to claim");

        lastClaimTime[msg.sender] = block.timestamp;
        mandToken.transfer(msg.sender, tokensToDistribute);

        emit TokensClaimed(msg.sender, tokensToDistribute);
    }

    function unstake(address candidate, uint amount) external {
        require(amount > 0, "Amount must be positive");
        Stake storage _stake = stakes[msg.sender][candidate];

        require(_stake.amount >= amount, "Insufficient staked amount");

        totalReputation -= calculateReputation(stakes[msg.sender][candidate].amount);
        _stake.amount -= amount;
        totalStakedByUser[msg.sender] -= amount;
        updateReputation(msg.sender, candidate);
        totalReputation += calculateReputation(stakes[msg.sender][candidate].amount);

        mandToken.transfer(msg.sender, amount);

        emit Unstaked(msg.sender, candidate, amount);
    }
}
