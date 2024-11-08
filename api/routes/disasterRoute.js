const express = require("express");
const router = express.Router();
const disasterController = require("../controllers/disasterController");

// Disaster routes
router.get("/disasters", disasterController.getDisasters);
router.post("/disasters", disasterController.createDisaster);
router.put("/disasters/:id", disasterController.updateDisaster);
router.delete("/disasters/:id", disasterController.deleteDisaster);
router.get("/disasters/alert", disasterController.checkCityAlert);

module.exports = router;
