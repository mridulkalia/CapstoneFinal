// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract CrowdFunding {
    struct Campaign {
        address payable recipient;
        uint256 fundingGoal;
        uint256 amountRaised;
        bool isActive;
    }

    mapping(uint256 => Campaign) public campaigns;

    uint256 public campaignCount = 0;

    event CampaignCreated(uint256 campaignId, address recipient, uint256 fundingGoal);
    event DonationReceived(uint256 campaignId, address donor, uint256 amount);
    event Withdrawal(uint256 campaignId, address recipient, uint256 amount);

    function createCampaign(address payable _recipient, uint256 _goal) public {
        campaigns[campaignCount] = Campaign({
            recipient: _recipient,
            fundingGoal: _goal,
            amountRaised: 0,
            isActive: true
        });

        emit CampaignCreated(campaignCount, _recipient, _goal);
        campaignCount++;
    }

    function donate(uint256 _campaignId) public payable {
        require(campaigns[_campaignId].isActive, "Campaign is not active");
        require(msg.value > 0, "Donation must be greater than 0");

        campaigns[_campaignId].amountRaised += msg.value;

        emit DonationReceived(_campaignId, msg.sender, msg.value);
    }

    function withdraw(uint256 _campaignId) public {
        Campaign storage campaign = campaigns[_campaignId];
        require(
            campaign.amountRaised >= campaign.fundingGoal,
            "Funding Goal not reached"
        );

        require(
            msg.sender == campaign.recipient,
            "Only the recipient can withdraw"
        );

        campaign.isActive == false;

        (bool success, ) = campaign.recipient.call{
            value: campaign.amountRaised
        }("");
        // payable(campaign.recipient).transfer(campaign.amountRaised);

        require(success, "Transfer failed.");

        emit Withdrawal(_campaignId, campaign.recipient, campaign.amountRaised);
    }
}
