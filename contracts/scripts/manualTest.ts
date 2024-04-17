import { ethers } from "hardhat";

const trustDropAddress = "0x9fD2Cd5aA147e3dfCB41e65C126D66d05D7747Fd";

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

  let seedFundTx = await trustDrops.depositSeedFunds({value: ethers.parseEther('300')});
  await seedFundTx.wait();
  
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
  //     value: ethers.parseEther('300')
  // };
  // const sendEthTx = await signer[0].sendTransaction(tx);
  // await sendEthTx.wait();

  // let allocation = await trustDrops.allocation("0x5E0689720093Db5D739Ec1CC266f321026AcD5D5");
  // console.log("check allocation - ", allocation);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
