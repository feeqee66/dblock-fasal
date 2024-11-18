module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",   // Ganache's host
      port: 7545,          // Ganache's port
      network_id: "*",     // Match any network id
      gas: 6721975,        // Default gas limit (can be adjusted)
      gasPrice: 20000000000, // Optional, gas price setting
    },
  },
  compilers: {
    solc: {
      version: "0.8.21", // Make sure this matches the Solidity version you're using
    },
  },
};
