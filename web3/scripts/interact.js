const TransferFunds = artifacts.require("TransferFunds");

module.exports = async function(callback) {
  try {
    const contract = await TransferFunds.deployed();
    
    // Example: Get the owner's address
    const owner = await contract.owner();
    console.log("Owner:", owner);

    // Example: Check contract balance
    const balance = await web3.eth.getBalance(owner);
    console.log("Contract Balance:", web3.utils.fromWei(balance, "ether"));

    callback();
  } catch (error) {
    console.error("Error:", error);
    callback(error);
  }
};
