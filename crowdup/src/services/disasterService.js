import axios from "axios";

export const checkCityAlert = async (city) => {
  try {
    const response = await axios.get(`http://localhost:8000/disasters/alert`, {
      params: { city },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching city alert:", error);
    return { alertActive: false };
  }
};
