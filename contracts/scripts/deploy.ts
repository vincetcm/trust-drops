import { ethers } from "hardhat";

async function main() {
  // Deploying trust drops
  const trustDrops = await ethers.deployContract("TrustDrops");
  await trustDrops.waitForDeployment();
  console.log(
    `Trust drops deployed to ${trustDrops.target}`
  );

  let seedFundTx = await trustDrops.depositSeedFunds({value: ethers.parseEther('3000')});
  await seedFundTx.wait();
  console.log(
    `Seed fund transferred`
  );

  const rewardTx = await trustDrops.updateWeeklyTotalRewards([{weekNumber: 1, reward: ethers.parseEther("1000")}, {weekNumber: 2, reward: ethers.parseEther("1000")}, {weekNumber: 3, reward: ethers.parseEther("1000")}, {weekNumber: 4, reward: ethers.parseEther("1000")}, {weekNumber: 5, reward: ethers.parseEther("1000")}, {weekNumber: 6, reward: ethers.parseEther("6000")}, {weekNumber: 7, reward: ethers.parseEther("7000")}, {weekNumber: 8, reward: ethers.parseEther("8000")}, {weekNumber: 9, reward: ethers.parseEther("1000")}, {weekNumber: 10, reward: ethers.parseEther("1000")}, {weekNumber: 11, reward: ethers.parseEther("1000")}]);
  await rewardTx.wait();
  console.log(
    `weekly rewards set`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
