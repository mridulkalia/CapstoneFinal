pragma solidity ^0.5.0;

contract TransferFunds{
    
    address public owner;

    constructor() public{
        owner = msg.sender; // Set the owner to the deployer of the contract
    }

    modifier onlyOwner {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    function transfer(address payable recipient) external payable onlyOwner {
        require(msg.value > 0, "Must send some Ether");
        require(recipient != address(0), "Invalid Recipient Address");

        bool success = recipient.send(msg.value);
        require(success, "Failed to send Ether");
    }

    function getBalance() external view returns (uint256){
        return owner.balance;
    }
}
