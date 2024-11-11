import { expect } from "chai";
import { artifacts, contract } from "truffle";

const TransferFunds = artifacts.require("TransferFunds");

contract("TransferFunds", (accounts) => {
    const [owner, recipient] = accounts;

    let transferFunds;

    beforeEach(async () => {
        transferFunds = await TransferFunds.new();
    });

    it("should deploy the contract and set the correct owner", async () => {
        const contractOwner = await transferFunds.owner();
        expect(contractOwner).to.equal(owner);
    });

    it("should allow the owner to deposit Ether and transfer it to another address", async () => {
        await web3.eth.sendTransaction({ from: owner, to: transferFunds.address, value: web3.utils.toWei("1", "ether") });

        const contractBalance = await web3.eth.getBalance(transferFunds.address);
        expect(web3.utils.fromWei(contractBalance, "ether")).to.equal("1");

        const transferAmount = web3.utils.toWei("0.05", "ether");
        await transferFunds.transferFunds(recipient, { from: owner, value: transferAmount });

        const recipientBalanceAfter = await web3.eth.getBalance(recipient);
        expect(Number(web3.utils.fromWei(recipientBalanceAfter, "ether"))).to.be.above(0);
    });

    it("should not allow non-owner to transfer funds", async () => {
        try {
            await transferFunds.transferFunds(recipient, { from: recipient, value: web3.utils.toWei("0.05", "ether") });
            throw new Error("Expected error not received");
        } catch (error) {
            expect(error.message).to.include("Not authorized");
        }
    });

    it("should return the correct balance for the owner", async () => {
        await web3.eth.sendTransaction({ from: owner, to: transferFunds.address, value: web3.utils.toWei("1", "ether") });

        const ownerBalance = await transferFunds.getOwnerBalance();
        expect(web3.utils.fromWei(ownerBalance, "ether")).to.equal(web3.utils.fromWei(await web3.eth.getBalance(owner), "ether"));
    });
});
