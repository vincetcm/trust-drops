import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("TrustDrops", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployTrustDropsFixture() {
    const [owner, otherAccount] = await ethers.getSigners();

    const TrustDropsFactory = await ethers.getContractFactory("TrustDrops");
    const trustDrops = await TrustDropsFactory.deploy();

    return { trustDrops, owner, otherAccount };
  }

  async function deployTrustDropsWithSeedFixture() {
    const [owner, alice, bob] = await ethers.getSigners();

    const TrustDropsFactory = await ethers.getContractFactory("TrustDrops");
    const trustDrops = await TrustDropsFactory.deploy();

    const tx = await trustDrops.depositSeedFunds({value: ethers.parseEther('1000')});
    await tx.wait();

    return { trustDrops, owner, alice, bob };
  }

  async function deployTrustDropsWithApprovedFixture() {
    const [owner, alice, bob, john] = await ethers.getSigners();

    const TrustDropsFactory = await ethers.getContractFactory("TrustDrops");
    const trustDrops = await TrustDropsFactory.deploy();

    let tx = await trustDrops.depositSeedFunds({value: ethers.parseEther('1000')});
    await tx.wait();

    tx = await trustDrops.approve(alice.address, ethers.keccak256(ethers.toUtf8Bytes("twitterid")))
    await tx.wait();
    tx = await trustDrops.approve(john.address, ethers.keccak256(ethers.toUtf8Bytes("twitteridjohn")))
    await tx.wait();
    tx = await trustDrops.approve(bob.address, ethers.keccak256(ethers.toUtf8Bytes("twitteridbob")))
    await tx.wait();

    const sendTx = {
        to: await trustDrops.getAddress(),
        value: ethers.parseEther('10000')
    };
    const sendEthTx = await bob.sendTransaction(sendTx);
    await sendEthTx.wait();

    return { trustDrops, owner, alice, bob, john };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { trustDrops, owner } = await loadFixture(deployTrustDropsFixture);

      expect(await trustDrops.owner()).to.equal(owner.address);
    });
  });

  describe("Approval", function () {
    it("Should approve fresh address", async function () {
      const { trustDrops, owner, alice } = await loadFixture(deployTrustDropsWithSeedFixture);
      const preBal = await ethers.provider.getBalance(alice.address);
      const tx = await trustDrops.approve(alice.address, ethers.keccak256(ethers.toUtf8Bytes("twitterid")))
      await tx.wait();
      const postBal = await ethers.provider.getBalance(alice.address);
      expect(await trustDrops.approvedAddress(alice.address)).to.equal(true);
      expect(postBal - preBal).to.equal(ethers.parseEther('30'));
    })

    it("Already approved address not allowed", async function () {
      const { trustDrops, owner, alice } = await loadFixture(deployTrustDropsWithSeedFixture);
      const tx = await trustDrops.approve(alice.address, ethers.keccak256(ethers.toUtf8Bytes("twitterid")))
      await tx.wait();
      
      await expect(trustDrops.approve(alice.address, ethers.keccak256(ethers.toUtf8Bytes("twitterid")))).to.be.revertedWith(
        "TrustDrops::Address already approved"
      );
    })

    it("Already twitter not allowed", async function () {
      const { trustDrops, owner, alice, bob } = await loadFixture(deployTrustDropsWithSeedFixture);
      const tx = await trustDrops.approve(alice.address, ethers.keccak256(ethers.toUtf8Bytes("twitterid")))
      await tx.wait();
      
      await expect(trustDrops.approve(bob.address, ethers.keccak256(ethers.toUtf8Bytes("twitterid")))).to.be.revertedWith(
        "TrustDrops::Id already approved"
      );
    })
  });
  describe("Staking", function () {
    it("Should fail for unapproved account", async function () {
      const { trustDrops, owner, alice, bob } = await loadFixture(deployTrustDropsWithSeedFixture);
      await expect(trustDrops.connect(alice).stake(owner.address, {value: ethers.parseEther("10")})).to.be.revertedWith(
        "Link your wallet with twitter to stake"
      );
    })

    it("Should work for approved account", async function () {
      const { trustDrops, owner, alice, bob, john } = await loadFixture(deployTrustDropsWithApprovedFixture);
      let tx = await trustDrops.connect(alice).stake(owner.address, {value: ethers.parseEther("9")}); //3
      await tx.wait();
      tx = await trustDrops.connect(alice).stake(bob.address, {value: ethers.parseEther("9")}); //3
      await tx.wait();
      tx = await trustDrops.connect(bob).stake(john.address, {value: ethers.parseEther("9")}); //3
      await tx.wait();
      tx = await trustDrops.connect(john).stake(owner.address, {value: ethers.parseEther("9")}); //6
      await tx.wait();
      tx = await trustDrops.connect(john).stake(bob.address, {value: ethers.parseEther("9")}); //6
      await tx.wait();

      const rewardTx = await trustDrops.updateWeeklyTotalRewards([{weekNumber: 1, reward: ethers.parseEther("1000")}, {weekNumber: 2, reward: ethers.parseEther("1000")}, {weekNumber: 3, reward: ethers.parseEther("1000")}, {weekNumber: 4, reward: ethers.parseEther("1000")}, {weekNumber: 5, reward: ethers.parseEther("1000")}, {weekNumber: 6, reward: ethers.parseEther("6000")}, {weekNumber: 7, reward: ethers.parseEther("7000")}, {weekNumber: 8, reward: ethers.parseEther("8000")}, {weekNumber: 9, reward: ethers.parseEther("1000")}, {weekNumber: 10, reward: ethers.parseEther("1000")}, {weekNumber: 11, reward: ethers.parseEther("1000")}]);
      await rewardTx.wait();
      console.log(ethers.formatEther(await trustDrops.allocation(bob.address)));
      await ethers.provider.send("evm_increaseTime", [2*7*25*60*60])
      await ethers.provider.send("evm_mine");
      console.log(ethers.formatEther(await trustDrops.allocation(owner.address)));

      tx = await trustDrops.connect(john).unstake(owner.address, ethers.parseEther("5")); //5
      await tx.wait();

      await ethers.provider.send("evm_increaseTime", [1*7*25*60*60])
      await ethers.provider.send("evm_mine");
      console.log(ethers.formatEther(await trustDrops.allocation(owner.address)));

      // tx = await trustDrops.connect(bob).claimTokens();
      // await tx.wait();

      tx = await trustDrops.connect(alice).stake(owner.address, {value: ethers.parseEther("16")}); // 7
      await tx.wait();
      tx = await trustDrops.connect(alice).stake(bob.address, {value: ethers.parseEther("91")}); //13
      await tx.wait();
      tx = await trustDrops.connect(bob).stake(john.address, {value: ethers.parseEther("16")}); //8
      await tx.wait();
      tx = await trustDrops.connect(john).stake(owner.address, {value: ethers.parseEther("5")}); // 11
      await tx.wait();
      tx = await trustDrops.connect(john).stake(bob.address, {value: ethers.parseEther("16")}); //15
      await tx.wait();
      await ethers.provider.send("evm_increaseTime", [1*7*25*60*60]);
      await ethers.provider.send("evm_mine");
      console.log(ethers.formatEther(await trustDrops.allocation(owner.address)));
    })

    // it("Should work for approved account", async function () {
    //   const { trustDrops, owner, alice, bob, john } = await loadFixture(deployTrustDropsWithApprovedFixture);
    //   let tx = await trustDrops.connect(alice).stake(owner.address, {value: ethers.parseEther("0.1")}); //3
    //   await tx.wait();
    //   console.log(await trustDrops.reputation(owner.address));
    //   tx = await trustDrops.connect(bob).stake(owner.address, {value: ethers.parseEther("0.1")}); //3
    //   await tx.wait();
    //   console.log(await trustDrops.reputation(owner.address));
    //   tx = await trustDrops.connect(john).stake(owner.address, {value: ethers.parseEther("0.1")}); //6
    //   await tx.wait();
    //   console.log(await trustDrops.reputation(owner.address));
    // })
  });

  describe("Rewards", function () {
    it("should allocate rewards after a week", async function () {

    })
  });

  // describe("Withdrawals", function () {
  //   describe("Validations", function () {
  //     it("Should revert with the right error if called too soon", async function () {
  //       const { lock } = await loadFixture(deployOneYearLockFixture);

  //       await expect(lock.withdraw()).to.be.revertedWith(
  //         "You can't withdraw yet"
  //       );
  //     });

  //     it("Should revert with the right error if called from another account", async function () {
  //       const { lock, unlockTime, otherAccount } = await loadFixture(
  //         deployOneYearLockFixture
  //       );

  //       // We can increase the time in Hardhat Network
  //       await time.increaseTo(unlockTime);

  //       // We use lock.connect() to send a transaction from another account
  //       await expect(lock.connect(otherAccount).withdraw()).to.be.revertedWith(
  //         "You aren't the owner"
  //       );
  //     });

  //     it("Shouldn't fail if the unlockTime has arrived and the owner calls it", async function () {
  //       const { lock, unlockTime } = await loadFixture(
  //         deployOneYearLockFixture
  //       );

  //       // Transactions are sent using the first signer by default
  //       await time.increaseTo(unlockTime);

  //       await expect(lock.withdraw()).not.to.be.reverted;
  //     });
  //   });
  // });
});