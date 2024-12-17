const fetch = require("node-fetch");
const bodyParser = require('body-parser');



exports.getCrisisPrediction = async (req, res) => {
  try {
    // Extract form-data from the request
    const { temperature, oxygen, humidity } = req.body;
    console.log(temperature)
    console.log(oxygen)
    console.log(humidity)

    // Validate required inputs
    if (!temperature || !humidity) {
      return res.status(400).json({
        message: "Temperature and humidity are required for prediction.",
      });
    }

    // Prepare the data for the ML model
    const requestBody = new URLSearchParams({
      temperature: temperature.toString(),
      oxygen: oxygen?.toString() || "0", // Default to 0 if not provided
      humidity: humidity.toString(),
    });

    console.log(requestBody)
    

    console.log("Request Body to ML Model:", requestBody.toString());

    // Send the request to the ML model
    const response = await fetch("http://127.0.0.1:5000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: requestBody.toString(), // URL-encoded format for the ML model
    });

    if (!response.ok) {
      console.error("Error from ML model:", response.statusText);
      return res.status(500).json({ message: "Error interacting with the ML model." });
    }

    // Parse response from the ML model server
    const data = await response.text();
    console.log("Response from ML Model:", data);

    // Determine prediction message and probability
    const prediction = data.includes("danger")
      ? "Your Forest is in Danger "
      : "Your Forest is Safe ";
    const probability = data;

    // Send response back to the client
    res.status(200).json({
      prediction,
      probability,
      message: "Prediction received successfully.",
    });
  } catch (error) {
    console.error("Error during request to ML model:", error); // Log the error
    res.status(500).json({ message: "Error during request to ML model", error });
  }
};
// Fetch weather and O3 details for a given state
exports.getWeatherDetails = async (req, res) => {
  const { state } = req.params;
  console.log("Received state:", state);

  if (!state) {
    return res.status(400).json({ message: "State is required." });
  }

  try {
    // Weather API endpoint
    const weatherAPI = `https://api.openweathermap.org/data/2.5/weather?q=${state},IN&appid=5dcfe29fba13e2ab9c94e3045eefaced&units=metric`;

    // Ozone API (for Air Pollution Data)
    const ozoneAPI = `https://api.openweathermap.org/data/2.5/air_pollution?lat={latitude}&lon={longitude}&appid=5dcfe29fba13e2ab9c94e3045eefaced`;

    // Fetch weather details
    const weatherResponse = await fetch(weatherAPI);
    const weatherData = await weatherResponse.json();

    if (!weatherResponse.ok) {
      return res
        .status(500)
        .json({ message: "Failed to fetch weather data from API." });
    }

    // Fetch latitude and longitude from weather response
    const { lat, lon } = weatherData.coord;

    // Fetch ozone details using latitude and longitude
    const ozoneResponse = await fetch(
      ozoneAPI.replace("{latitude}", lat).replace("{longitude}", lon)
    );
    const ozoneData = await ozoneResponse.json();

    if (!ozoneResponse.ok) {
      return res
        .status(500)
        .json({ message: "Failed to fetch ozone data from API." });
    }

    // Extract relevant weather and ozone data
    const weatherDetails = {
      temperature: weatherData.main.temp,
      humidity: weatherData.main.humidity,
      windSpeed: weatherData.wind.speed,
      precipitation: weatherData.rain ? weatherData.rain["1h"] || 0 : 0,
      ozone: ozoneData.list[0].components.o3 || "N/A", // Ozone (O3)
    };

    res.status(200).json(weatherDetails);
  } catch (error) {
    console.error("Error fetching weather details:", error);
    res.status(500).json({ message: "Error fetching weather details", error });
  }
};

// Check if a city has an active alert
exports.checkCityAlert = async (req, res) => {
  const { city } = req.query;

  if (!city) {
    return res
      .status(400)
      .json({ message: "City is required for alert check." });
  }

  try {
    const alert = await Disaster.findOne({ city });
    if (alert) {
      res.status(200).json({
        alertActive: true,
        alertMessage: alert.description,
      });
    } else {
      res.status(200).json({
        alertActive: false,
        message: "No active alerts for this city.",
      });
    }
  } catch (error) {
    console.error("Error checking city alert:", error);
    res.status(500).json({ message: "Error checking city alert", error });
  }
};
