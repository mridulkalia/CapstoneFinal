const Campaign = require("../models/campaignSchema");

exports.createCampaign = async (req, res) => {
  try {
    console.log(req.body); // Logs the request body
    console.log(req.file); // Logs the uploaded file (if any)

    const {
      title,
      description,
      amount,
      deadline,
      targetAmount,
      location,
      organizerName,
      organizerContact,
      campaignType,
      organizationName,
      organizationEmail,
      contactPersonName,
      ethereumAddress, // Include this in the campaign creation
    } = req.body;

    // No need to parse the location if it's already an object
    const parsedLocation =
      typeof location === "string" ? JSON.parse(location) : location;

    const profilePicture = req.file ? req.file.path : null;
    const sanitizedDescription =
      description && description.trim()
        ? description
        : "No description provided";

    const newCampaign = new Campaign({
      title,
      description: sanitizedDescription,
      amount,
      deadline,
      targetAmount,
      location: parsedLocation,
      organizerName,
      organizerContact,
      campaignType,
      organizationName,
      organizationEmail,
      contactPersonName,
      profilePicture,
      ethereumAddress, // Include this in the campaign creation
    });

    const savedCampaign = await newCampaign.save();

    res.status(201).json({
      message: "Campaign created successfully",
      campaign: savedCampaign,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to create campaign", error: error.message });
  }
};

exports.getAllCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find().sort({ createdAt: -1 }); // You can add sorting or filtering here if needed

    // Send response
    res.status(200).json({
      message: "Campaigns fetched successfully",
      campaigns,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to fetch campaigns", error: error.message });
  }
};

exports.getCampaignById = async (req, res) => {
    try {
      const { id } = req.params; // Make sure `id` is a valid ObjectId
      const campaign = await Campaign.findById(id);
  
      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }
  
      res.status(200).json({
        message: "Campaign fetched successfully",
        campaign,
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Failed to fetch campaign", error: error.message });
    }
  };

exports.addTransaction = async (req, res) => {
    try {
      const { id } = req.params; // Campaign ID
      const { donorAddress, amount } = req.body;
  
      const campaign = await Campaign.findById(id);
      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }
  
      // Create a new transaction and push it to the campaign's transactions array
      campaign.transactions.push({
        donorAddress,
        amount,
        date: new Date(),
      });
  
      await campaign.save();
  
      res.status(201).json({
        message: "Transaction added successfully",
        campaign,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to add transaction", error: error.message });
    }
  };
    
  // Controller to get all transactions for a specific campaign
  exports.getTransactionsByCampaignId = async (req, res) => {
    try {
      const { id } = req.params; // Get campaign ID from request parameters
  
      // Find campaign by ID and only select transactions
      const campaign = await Campaign.findById(id).select('transactions title');
  
      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }
  
      res.status(200).json({
        message: `Transactions for campaign: ${campaign.title}`,
        transactions: campaign.transactions,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ 
        message: "Failed to fetch campaign transactions",
        error: error.message 
      });
    }
  };
  