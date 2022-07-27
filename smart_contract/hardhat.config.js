require("@nomiclabs/hardhat-waffle");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.9",
  networks: {
    goerli: {
      url: "https://eth-goerli.g.alchemy.com/v2/baeeuAof58NPLt07dSlMK77X5LteKwG6",
      accounts: ["814c679c071b45ce3936880d0237446bf1a298d144f5c18bfa4d7f8f5f286be8"],
    },
  },
};
