const Campaign = require("../models/campaignSchema");

exports.createCampaign = async (req, res) => {
  try {
    const { title, description, amount, deadline, targetAmount, location } =
      req.body;
    const profilePicture = req.file ? req.file.path : null;
    const parsedLocation = location ? JSON.parse(location) : {};
    const sanitizedDescription =
      description && description.trim()
        ? description
        : "No description provided";

    // Create a new campaign document
    const newCampaign = new Campaign({
      title,
      description: sanitizedDescription,
      amount,
      deadline,
      targetAmount,
      location: parsedLocation,
      profilePicture,
    });

    // Save the campaign to the database
    const savedCampaign = await newCampaign.save();

    // Send response
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
    const campaigns = await Campaign.find(); // You can add sorting or filtering here if needed

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
