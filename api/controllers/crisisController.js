// controllers/crisisChainController.js
const fetch = require("node-fetch");

// Handle the prediction request
exports.getCrisisPrediction = async (req, res) => {
  const { temperature, oxygen, humidity } = req.body;

  if (!temperature || !oxygen || !humidity) {
    return res
      .status(400)
      .json({ message: "Temperature, Oxygen, and Humidity are required." });
  }

  try {
    // Prepare the request data for ML model
    const requestBody = {
      temperature,
      oxygen,
      humidity,
    };

    // Send the request to the ML model
    const response = await fetch("http://127.0.0.1:5000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" }, // Use JSON content type
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      return res
        .status(500)
        .json({ message: "Error interacting with ML model." });
    }

    // Parse response from ML model server
    const data = await response.text();
    let prediction = data.includes("danger")
      ? "Your Forest is in Danger."
      : "Your Forest is Safe.";
    let probability =
      data.match(/Probability of fire occurring is (\d+\.\d+)/)?.[1] || "N/A";

    res.status(200).json({
      prediction,
      probability,
      message: "Prediction received successfully.",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error during request to ML model", error });
  }
};

// Check if a city has an active alert
exports.checkCityAlert = async (req, res) => {
  const { city } = req.query;

  try {
    const alert = await Disaster.findOne({ city });
    if (alert) {
      res
        .status(200)
        .json({ alertActive: true, alertMessage: alert.description });
    } else {
      res.status(200).json({ alertActive: false });
    }
  } catch (error) {
    res.status(500).json({ message: "Error checking city alert", error });
  }
};
