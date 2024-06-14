import { ethers } from "hardhat";

const trustDropAddress = "0xf9A67460Cd94B9F098ef211c8E46Ee27CDDEbb46";

async function stake(signer, address, amount) {
  const trustDropsFactory = await ethers.getContractFactory("TrustDrops");
  const trustDrops = trustDropsFactory.attach(trustDropAddress);
  let stakeTx = await trustDrops.connect(signer).stake(address, {value: amount});
  await stakeTx.wait();
  const userCredScore = await trustDrops.reputation(address);
  console.log("userCredScore", userCredScore);
}

async function unstake(signer, address, amount) {
  const trustDropsFactory = await ethers.getContractFactory("TrustDrops");
  const trustDrops = trustDropsFactory.attach(trustDropAddress);
  let unstakeTx = await trustDrops.connect(signer).unstake(address, amount);
  await unstakeTx.wait();
  const userCredScore = await trustDrops.reputation(address);
  console.log("userCredScore", userCredScore);
}

async function main() {
  const signer = await ethers.getSigners();
  const trustDropsFactory = await ethers.getContractFactory("TrustDrops");
  const trustDrops = trustDropsFactory.attach(trustDropAddress);

  // const approved = await trustDrops.approvedAddress("0x00dda9fd9a50b4d5e1586d1752c3b3840e4f0234");
  // console.log(approved);
  // const approver = await trustDrops.approver();
  // console.log(approver)

  // let seedFundTx = await trustDrops.depositSeedFunds({value: ethers.parseEther('100000')});
  // await seedFundTx.wait();

  // const provider = await ethers.getDefaultProvider()
  // console.log(await ethers.provider.getBalance("0xe1E4c0562780A0b7ecF9231697FB883205c6A977"));
  
  // try {
  //   let approveTx = await trustDrops.approve("0xEDa85d5bA2eB6a20aaE7A5458fFac7F4AA74f7ed", ethers.keccak256(ethers.toUtf8Bytes("example")));
  //   await approveTx.wait();
  // } catch (error) {
  //   console.log(error);
  // }

  // await stake(signer[0], "0x5E0689720093Db5D739Ec1CC266f321026AcD5D5", ethers.parseEther("9.0"));
  // await stake(signer[0], "0x5E0689720093Db5D739Ec1CC266f321026AcD5D5", ethers.parseEther("16.0"));
  // await unstake(signer[0], "0x5E0689720093Db5D739Ec1CC266f321026AcD5D5", ethers.parseEther("9.0"));
  // await unstake(signer[0], "0x5E0689720093Db5D739Ec1CC266f321026AcD5D5", ethers.parseEther("11.0"));
  
  // await stake(signer[1], "0x5E0689720093Db5D739Ec1CC266f321026AcD5D5", ethers.parseEther("9.0"));
  
  // const tx = {
  //     to: trustDropAddress,
  //     value: ethers.parseEther('1'),
  //     gasLimit: 250000000,
  //     gasPrice: 100
  // };
  // const sendEthTx = await signer[0].sendTransaction(tx);
  // await sendEthTx.wait();
  let allocation = await trustDrops.seedFund();
  console.log("check allocation - ", ethers.formatEther(allocation));

  let checkAddr = await trustDrops.totalReputation();
  console.log("check allocation - ", checkAddr);

//   const tx = {
//     to: "0xED71848f4e3DE1781781062f2afc9873d9bCb0c3",
//     value: ethers.parseEther('2000000')
// };
// const sendEthTx = await signer[0].sendTransaction(tx);
// await sendEthTx.wait();


  // let totRep = await trustDrops.allocation("0x9c23F47Feb605f7C1674Ab4E6E3E64E2Cd195d1e");
  // console.log("check totRep - ", totRep);

  // const rewardDistributorFactory = await ethers.getContractFactory("RewardsDistributor");
  // const rewardDistro = rewardDistributorFactory.attach("0x9Da7d191681Fc24Dc9832E050A4465636D51d647");
  // let totRep = await rewardDistro.allocation("0x8d758a992fd0f8762292d6fef975bc4363a571af");
  // console.log("check totRep - ", totRep);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
