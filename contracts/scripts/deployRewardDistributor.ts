import { ethers } from "hardhat";

async function main() {
  // Deploying trust drops
  const rewardDistributor = await ethers.deployContract("RewardsDistributor", [""]);
  await rewardDistributor.waitForDeployment();
  console.log(
    `RewardDistributor deployed to ${rewardDistributor.target}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
