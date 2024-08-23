const CrowdFunding = artifacts.require("CrowdFunding");

contract("CrowdFunding", (accounts) => {
  let contractInstance;

  beforeEach(async () => {
    contractInstance = await CrowdFunding.new();
  });

  it("should create a new campaign", async () => {
    const recipient = accounts[1];
    const fundingGoal = web3.utils.toWei("5", "ether");

    await contractInstance.createCampaign(recipient, fundingGoal, {gas: 5000000});

    const campaign = await contractInstance.campaigns(0);
    assert.equal(campaign.recipient, recipient, "Recipient address mismatch");
    assert.equal(campaign.fundingGoal.toString(), fundingGoal, "Funding goal mismatch");
    assert.equal(campaign.amountRaised.toString(), "0", "Initial amount raised should be 0");
    assert.equal(campaign.isActive, true, "Campaign should be active");
  });

  it("should accept donations", async () => {
    const recipient = accounts[1];
    const fundingGoal = web3.utils.toWei("5", "ether");

    await contractInstance.createCampaign(recipient, fundingGoal, {gas:5000000});

    const donationAmount = web3.utils.toWei("1", "ether");
    await contractInstance.donate(0, { from: accounts[2], value: donationAmount });

    const campaign = await contractInstance.campaigns(0);
    assert.equal(campaign.amountRaised.toString(), donationAmount, "Donation amount mismatch");
  });
});
