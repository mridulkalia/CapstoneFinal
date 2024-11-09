const express = require('express');
const { createCampaign, getAllCampaigns } = require('../controllers/campaignController');
const router = express.Router();

// POST route for creating a new campaign
router.post('/campaign/create', createCampaign);

// GET route for fetching all campaigns
router.get('/campaigns', getAllCampaigns);

module.exports = router;
