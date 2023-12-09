import { ethers } from "hardhat";

async function main() {
  const mandToken = await ethers.deployContract("MandeNetwork", ["0xD3db9D11c09cECd2E91bdE73F710dE6094179FA0"]);
  await mandToken.waitForDeployment();
  console.log(
    `Mand token deployed to ${mandToken.target}`
  );

  // Deploying anon-aadhaar verification contracts
  const verifier = await ethers.deployContract("Verifier");
  await verifier.waitForDeployment();
  const _verifierAddress = verifier.getAddress();
  const appId = BigInt(
    "1054725213937889195122827708128950524547440836608"
  ).toString();
  const anonAadhaarVerifier = await ethers.deployContract(
    "AnonAadhaarVerifier",
    [_verifierAddress, appId]
  );
  await anonAadhaarVerifier.waitForDeployment();
  const _anonAadhaarVerifierAddress = anonAadhaarVerifier.getAddress();
  
  // Deploying trust drops
  const trustDrops = await ethers.deployContract("TrustDrops", [mandToken.target, _anonAadhaarVerifierAddress]);
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
