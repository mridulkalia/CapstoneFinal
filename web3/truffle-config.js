require('babel-register');
require('babel-polyfill');
module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 7545,            // Ganache GUI default port
      network_id: 5777,      // Ganache network id (default: any)
      gas: 6721975,          // Gas limit
      gasPrice: 20000000000, // Gas price
    },
    ganache: {
      host: "127.0.0.1",   // Host for Ganache
      port: 7545,          // Default Ganache CLI port
      network_id: "5777",  // Network ID for Ganache
      gas: 6721975,        // Optional: Adjust gas limit if necessary
    },
  },
  compilers: {
    solc: {
      version: "0.8.0",      // Specify the version of Solidity you want to use
    },
  },
  contracts_directory: "./contracts",  // This specifies the contract folder
  contracts_build_directory: "./build/contracts"  //
};

