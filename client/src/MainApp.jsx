import { useState } from 'react';
import CreateCampaignForm from './components/CreateCampaignForm';
import CampaignCard from './components/CampaignCard';
// import CampaignPage from './components/CampaignPage';

function MainApp() {
    const [campaigns, setCampaigns] = useState([]);

    const addCampaign = (campaign) => {
        setCampaigns([...campaigns, campaign]);
    };

    return (
        <div className="container mx-auto p-4">
            <CreateCampaignForm onCreate={addCampaign} />

            <h2 className="text-2xl lg:text-5xl text-center my-10 lg:my-12 font-bold text-green-600">ACTIVE CAMPAIGNS</h2>


            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                {campaigns.map((campaign, index) => (
                    <CampaignCard key={index} campaign={campaign} campaignId={index} />
                ))}
            </div>
        </div>
    );
}

export default MainApp;
