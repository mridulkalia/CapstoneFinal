const Resource = require("../models/resource");
const User = require("../models/userSchema");
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const registerResource = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).send("Invalid user ID");
    }

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }

    const resourceData = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phone: req.body.phone,
      location: req.body.location,
      resourceType: req.body.resourceType,
      identity: req.files?.identity?.[0]?.path, // File upload handling
      certificate: req.files?.certificate?.[0]?.path, // File upload handling
      additionalInfo: req.body.additionalInfo,
      emergencyContactName: req.body.emergencyContactName,
      emergencyContactPhone: req.body.emergencyContactPhone,
      experience: req.body.experience,
      socialMedia: req.body.socialMedia,
      agreeToTerms: req.body.agreeToTerms,
      userId: user._id, // Assign the user ID to the resource
    };

    const newResource = new Resource(resourceData);
    await newResource.save();

    res.status(201).json({
      message: "Resource registered successfully",
      resource: newResource,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Server error while registering resource" });
  }
};

const updateResourceStatus = async (req, res) => {
  try {
    const { id } = req.params; // Extracting id from params
    const { status } = req.body;
    const validStatuses = ["pending", "accepted", "rejected"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const updatedResource = await Resource.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedResource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    res.json({ message: "Resource status updated", resource: updatedResource });
  } catch (error) {
    console.error("Error updating resource status:", error);
    res
      .status(500)
      .json({ message: "Server error while updating resource status" });
  }
};

const getResource = async (req, res) => {
  try {
    const resources = await Resource.find();
    res.json(resources);
  } catch (error) {
    console.error("Error fetching resources:", error);
    res.status(500).json({ message: "Server error while fetching resources" });
  }
};

const sendProposalEmail = async (req, res) => {
  const { to, subject, message } = req.body;

  if (!to || !subject || !message) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Create a transporter object using SMTP transport
  const transporter = nodemailer.createTransport({
    service: "gmail", // or any other service you prefer
    auth: {
      user: process.env.EMAIL_USER, // your email
      pass: process.env.EMAIL_PASS, // your email password
    },
  });

  // Email options
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    html: message,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Failed to send email" });
  }
};


module.exports = {
  registerResource,
  updateResourceStatus,
  getResource,
  sendProposalEmail,
};
