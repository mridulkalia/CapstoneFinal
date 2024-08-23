import { useState } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import web3 from '../Web3';
import CrowdFundingContract from '../CrowdFunding';

function CreateCampaignForm({ onCreate }) {
    const [campaignData, setCampaignData] = useState({
        title:'',
        name: '',
        address: '',
        city: '',
        state: '',
        email: '',
        phoneNumber: '',
        description:'',
        recipient: '',
        fundingGoal: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCampaignData({
            ...campaignData,
            [name]: value,
        });
    };

    const rupeesToEther =  (rupees) =>{
        const conversionRate = 200000;

        return rupees / conversionRate;
    }

    const createCampaign = async (e) => {
        e.preventDefault();
        console.log('Campaign Data:', campaignData); // Debugging line

        const etherFundingGoal = rupeesToEther(parseFloat(campaignData.fundingGoal));

        const weiFundingGoal = web3.utils.toWei(etherFundingGoal.toString(), 'ether');
        const accounts = await web3.eth.getAccounts();
        await CrowdFundingContract.methods
            .createCampaign(campaignData.recipient, weiFundingGoal)
            .send({ from: accounts[0], gas:3000000 });

        const campaignId = await CrowdFundingContract.methods.campaignCount().call();
        const campaignIdNumber = Number(campaignId);
        console.log(campaignId);
        console.log(campaignIdNumber);
        const campaign = await CrowdFundingContract.methods.campaigns(campaignIdNumber - 1).call();
        console.log(campaign);

        const campaignDataFormatted = {
            ...campaignData,
            fundingGoal: campaign.fundingGoal.toString(),
            amountRaised: campaign.amountRaised.toString(),
        };
        onCreate(campaignDataFormatted);
        // console.log(campaignData.name);
        // Reset the form
        setCampaignData({
            title:'',
            name: '',
            address: '',
            city: '',
            state: '',
            email: '',
            phoneNumber: '',
            description:'',
            recipient: '',
            fundingGoal: ''
        });
    };

    return (
        <div className="bg-white w-full p-5 lg:my-10 lg:p-10 rounded-lg shadow-lg lg:w-3/4 md:w-3/4 mx-auto">
            <h2 className="text-2xl md:text-3xl lg:text-4xl lg:mb-10 font-bold mb-4 text-center text-green-600">CREATE A CAMPAIGN</h2>
            <form onSubmit={createCampaign} className="space-y-8">
                <input
                    type="text"
                    name="title"
                    placeholder="Campaign Title"
                    value={campaignData.title}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    required
                />
                <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={campaignData.name}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    required
                />
                <input
                    type="text"
                    name="address"
                    placeholder="Your Address"
                    value={campaignData.address}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    required
                />
                <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={campaignData.city}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    required
                />
                <input
                    type="text"
                    name="state"
                    placeholder="State"
                    value={campaignData.state}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={campaignData.email}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    required
                />
                <input
                    type="tel"
                    name="phoneNumber"
                    placeholder="Phone Number"
                    value={campaignData.phoneNumber}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    required
                />
                <textarea
                    rows={4}
                    name="description"
                    placeholder="Enter your Description Here"
                    value={campaignData.description}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    required
                />
                <input
                    type="text"
                    name="recipient"
                    placeholder="Recipient Wallet Address"
                    value={campaignData.recipient}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    required
                />
                <input
                    type="number"
                    name="fundingGoal"
                    placeholder="Funding Goal (in ETH)"
                    value={campaignData.fundingGoal}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    required
                />
                <button type="submit" className="bg-green-600 my-12 text-white py-2 px-4 rounded-lg hover:bg-green-700">Create Campaign</button>
            </form>
        </div>
    );
}

CreateCampaignForm.propTypes = {
    onCreate: PropTypes.func.isRequired,
};

export default CreateCampaignForm;
