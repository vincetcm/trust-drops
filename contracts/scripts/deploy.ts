import { ethers } from "hardhat";

async function main() {
  // Deploying trust drops
  // const signer = await ethers.getSigners();
  // console.log(signer[0].address);
  const trustDrops = await ethers.deployContract("TrustDrops");
  await trustDrops.waitForDeployment();
  console.log(
    `Trust drops deployed to ${trustDrops.target}`
  );

  let seedFundTx = await trustDrops.depositSeedFunds({value: ethers.parseEther('1000')});
  await seedFundTx.wait();
  console.log(
    `Seed fund transferred`
  );

  const rewardsArray = [61132, 66568, 65044, 58410, 49187, 39475, 30577, 23080, 17099, 12498, 9048, 6506, 4655, 3319, 2361, 1676, 1189, 842, 596];
  let rewardsData = [];
  rewardsArray.map((amt, idx) => {
    const year = idx+1;
    for (let i=1; i<=52; i++) {
      rewardsData.push({weekNumber: ((52*(year-1))+i), reward: ethers.parseEther(amt.toString())})
    }
  })

  const rewardTx = await trustDrops.updateWeeklyTotalRewards(rewardsData);
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
