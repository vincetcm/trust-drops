import { ethers } from "hardhat";

async function main() {
  // Deploying trust drops
  const trustDrops = await ethers.deployContract("TrustDrops");
  await trustDrops.waitForDeployment();
  console.log(
    `Trust drops deployed to ${trustDrops.target}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
