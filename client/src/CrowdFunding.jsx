import CrowdFundingABI from './CrowdFunding.json';
import web3 from './Web3';
const CONTRACT_ADDRESS = "0xA612C2c2Df9ECBCfd48C1cC4716D0AFa5b0557f5";

const CrowdFundingContract = new web3.eth.Contract(CrowdFundingABI.abi, CONTRACT_ADDRESS);
console.log(CrowdFundingContract);

export default CrowdFundingContract;