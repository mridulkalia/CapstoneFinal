import axios from "axios";

export const createCampaign = async (campaign) => {
  try {
    const response = await axios.post(
      "http://localhost:8000/campaign/create",
      campaign
    );
    return response.data;
  } catch (error) {
    console.error(
      "Failed to create campaign:",
      error.response?.data || error.message
    );
    throw error;
  }
};
