const TransferFunds = artifacts.require("TransferFunds");

module.exports = async function(callback) {
  try {
    const contract = await TransferFunds.deployed();

    const accounts = await web3.eth.getAccounts();
    const owner = accounts[0];
    const recipient = accounts[2];
    const transferAmount = web3.utils.toWei("0.05", "ether"); // Amount to transfer

    console.log("Owner's Address -> ", owner);
    console.log("Recipient's Address -> ", recipient);

    // Log initial balances
    let ownerBalanceBefore = await web3.eth.getBalance(owner);
    let recipientBalanceBefore = await web3.eth.getBalance(recipient);

    console.log("Owner Balance Before Transfer:", web3.utils.fromWei(ownerBalanceBefore, "ether"));
    console.log("Recipient Balance Before Transfer:", web3.utils.fromWei(recipientBalanceBefore, "ether"));

    // Transfer funds
    await contract.transfer(recipient, { from: owner, value: transferAmount });

    // Log balances after transfer
    let ownerBalanceAfter = await web3.eth.getBalance(owner);
    let recipientBalanceAfter = await web3.eth.getBalance(recipient);

    console.log("Owner Balance After Transfer:", web3.utils.fromWei(ownerBalanceAfter, "ether"));
    console.log("Recipient Balance After Transfer:", web3.utils.fromWei(recipientBalanceAfter, "ether"));

    callback();
  } catch (error) {
    console.error("Error:", error);
    callback(error);
  }
};
