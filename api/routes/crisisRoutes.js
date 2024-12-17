const express = require("express");
const router = express.Router();
const crisisChainController = require("../controllers/crisisController");

// Route to handle predicting the crisis (Forest Fire)
router.post("/predict", crisisChainController.getCrisisPrediction);

// Route to check if a city has an active alert
router.get("/city-alert", crisisChainController.checkCityAlert);
router.get("/weather/:state", crisisChainController.getWeatherDetails);

module.exports = router;
