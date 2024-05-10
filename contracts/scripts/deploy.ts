import { ethers } from "hardhat";

async function main() {
  // Deploying trust drops
  const trustDrops = await ethers.deployContract("TrustDrops");
  await trustDrops.waitForDeployment();
  console.log(
    `Trust drops deployed to ${trustDrops.target}`
  );

  let seedFundTx = await trustDrops.depositSeedFunds({value: ethers.parseEther('30000')});
  await seedFundTx.wait();
  console.log(
    `Seed fund transferred`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
