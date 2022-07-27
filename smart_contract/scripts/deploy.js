const hre = require("hardhat");

const main = async () => {
  const Transactions = await hre.ethers.getContractFactory("Transactions");
  const NFTs = await hre.ethers.getContractFactory("NFTMarketplace");

  const transactions = await Transactions.deploy();
  const nfts = await NFTs.deploy();

  await transactions.deployed();
  await nfts.deployed();

  console.log("Transactions deployed to:", transactions.address);
  console.log("NFTMarketplace deployed to:", nfts.address);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

runMain();
