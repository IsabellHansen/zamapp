import { ethers } from "hardhat";

async function main() {
  console.log("Deploying SimpleCounter contract...");

  // Get the ContractFactory and Signers here.
  const SimpleCounter = await ethers.getContractFactory("SimpleCounter");
  const simpleCounter = await SimpleCounter.deploy();

  await simpleCounter.waitForDeployment();

  const address = await simpleCounter.getAddress();
  console.log("SimpleCounter deployed to:", address);
  
  // 验证部署
  console.log("Verifying deployment...");
  const owner = await simpleCounter.owner();
  console.log("Owner:", owner);
  
  const count = await simpleCounter.getCount();
  console.log("Initial count:", count.toString());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });