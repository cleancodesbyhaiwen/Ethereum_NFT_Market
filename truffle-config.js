// infuraKey = 98e8a9488af042b492d5f6dd2314c0c7
// memonic = height bullet neither patch pig bread noble popular type head rich engine
// accunt address: 0x83B8A7d24006571Ddb257290B42FC47aad5D81cE

// get fake ether: https://goerlifaucet.com/
// https://goerli-faucet.pk910.de/

// both ribkeby and kovan  test networks are discommissioned

const HDWalletProvider = require("truffle-hdwallet-provider");
const infuraKey = "98e8a9488af042b492d5f6dd2314c0c7";
const mnemonic = "height bullet neither patch pig bread noble popular type head rich engine";

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*",
      //from: "0xF25AC2C7ACad7d05777159bF22c81166c41e2897"
    },
    goerli: {
      provider: () => new HDWalletProvider(mnemonic, `https://goerli.infura.io/v3/${infuraKey}`),
      network_id: 5,
      gas: 30000000,
      gasPrice: 30000000,
    },
  },
  compilers: {
    solc: {
      version: "0.8.19",
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};

