import { useState } from "react";
import CreateCampaignForm from "./CreateCampaignForm";;
import CampaignCard from "./CampaignCard";

function CampaignPage(){
    const [campaigns, setCampaigns] = useState([]);

    const handleCreateCampaign = (newCampaign) =>{
        setCampaigns([...campaigns, newCampaign]);
    };

    return(
        <div className="container mx-auto">
            <CreateCampaignForm onCreate={handleCreateCampaign} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {campaigns.map((campaign, index) => (
                    <CampaignCard key={index} campaign={campaign} />
                ))}
            </div>
        </div>
    );
}

export default CampaignPage