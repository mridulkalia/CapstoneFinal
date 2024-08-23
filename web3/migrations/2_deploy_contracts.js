const CrowdFunding = artifacts.require("CrowdFunding");

module.exports = function (deployer) {
  // Deploy the CrowdFunding contract
  deployer.deploy(CrowdFunding);
};

// 0xA612C2c2Df9ECBCfd48C1cC4716D0AFa5b0557f5 contract address
