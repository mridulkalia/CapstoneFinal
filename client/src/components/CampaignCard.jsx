import web3 from '../Web3';
import PropTypes from 'prop-types'; // Import PropTypes
import pic1 from '../assets/pic1.webp';
import CrowdFundingContract from '../CrowdFunding';
import { useState } from 'react';

function CampaignCard({ campaign, campaignId, onDonateSuccess }) {

    const [amountRaised, setAmountRaised] = useState(web3.utils.fromWei(campaign.amountRaised, 'ether'));

    const donate = async () => {
        const amount = prompt('Enter the amount you want to donate in Ether:');
        if (!amount) return;

        const accounts = await web3.eth.getAccounts();
        await CrowdFundingContract.methods
            .donate(campaignId)
            .send({ from: accounts[0], value: web3.utils.toWei(amount, 'ether') });

        const updatedCampaign = await CrowdFundingContract.methods.campaigns(campaignId).call();
        setAmountRaised(web3.utils.fromWei(updatedCampaign.amountRaised, 'ether'));

        if (onDonateSuccess) {
            onDonateSuccess(campaignId, updatedCampaign.amountRaised);
        }
    };

    // const withdrawFunds = async (campaignId) => {
        
    //         const accounts = await web3.eth.getAccounts();
    
    //         // Attempt to withdraw funds
    //         await CrowdFundingContract.methods.withdraw(campaignId).send({ from: accounts[0], gas: 3000000 });
    
    //         alert('Funds withdrawn successfully!');
        
    // };
    
    return (
        <>
                <div className="bg-white shadow-md rounded-lg p-4 lg:my-10 mb-6 w-full lg:w-full">
                    <div className="bg-gray-200 h-48 rounded-t-lg mb-4">
                        <img src={pic1} alt="Loading" className='h-48 w-full' />
                    </div>
                    <p className="text-3xl font-bold mb-2 text-green-600">{campaign.title}</p>
                    <div className='text-[20px] mt-6 flex justify-between'>
                        <p className='font-bold'>{campaign.city}</p>
                        <p className='font-bold'> {campaign.state}</p>
                    </div>
                    <p className="my-10 text-center"> {campaign.description}</p>
                    <div className='text-0.5xl flex justify-between'>
                        <p className="mt-2"><strong>Funding Goal:</strong> Rs. {web3.utils.fromWei(campaign.fundingGoal, 'ether') * 200000}</p>
                        <p className="mt-2"><strong>Amount Raised:</strong> Rs. {amountRaised * 200000}</p>
                    </div>
                    <button
                        onClick={donate}
                        className="bg-green-600 text-white py-2 px-4 rounded mt-4 w-full"
                    >
                        Donate
                    </button>
                </div>
        </>
    );
}

CampaignCard.propTypes = {
    campaign: PropTypes.shape({
        title: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        address: PropTypes.string.isRequired,
        city: PropTypes.string.isRequired,
        state: PropTypes.string.isRequired,
        recipient: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        fundingGoal: PropTypes.string.isRequired,
        amountRaised: PropTypes.string.isRequired,
    }).isRequired,
    campaignId: PropTypes.number.isRequired,
    onDonate: PropTypes.func.isRequired,
    onDonateSuccess: PropTypes.func
};

export default CampaignCard;
