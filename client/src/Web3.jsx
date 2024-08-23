import Web3 from 'web3';

const web3 = new Web3("http://127.0.0.1:7545");
console.log("Ganache setup succesfully", web3);

export default web3;