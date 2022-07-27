require('@nomiclabs/hardhat-waffle')

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.9",
  networks: {
    rinkeby: {
      url: 'https://eth-rinkeby.alchemyapi.io/v2/baeeuAof58NPLt07dSlMK77X5LteKwG6',
      accounts: [
        '23884c4d9abe1f24b05d6e5fe76ca0921b9427f6a66cd238d80d9b6bb6dfb87f',
      ],
    },
  },
};
