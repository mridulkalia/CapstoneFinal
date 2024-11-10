const Campaign = require("../models/campaignSchema");

exports.createCampaign = async (req, res) => {
    try {
        console.log(req.body); // Logs the request body
        console.log(req.file); // Logs the uploaded file (if any)
        
        const { 
            title, description, amount, deadline, targetAmount, 
            location, organizerName, organizerContact, 
            socialMediaLinks, campaignType, organizationName, 
            organizationEmail, contactPersonName 
        } = req.body;
        
        // No need to parse the location if it's already an object
        const parsedLocation = (typeof location === 'string') ? JSON.parse(location) : location;
        
        const profilePicture = req.file ? req.file.path : null;
        const sanitizedDescription = description && description.trim() ? description : "No description provided";
        
        const newCampaign = new Campaign({
            title,
            description: sanitizedDescription,
            amount,
            deadline,
            targetAmount,
            location: parsedLocation,
            organizerName,
            organizerContact,
            socialMediaLinks,
            campaignType,
            organizationName,
            organizationEmail,
            contactPersonName,
            profilePicture,
        });
        
        const savedCampaign = await newCampaign.save();
        
        res.status(201).json({
            message: "Campaign created successfully",
            campaign: savedCampaign,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to create campaign", error: error.message });
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
