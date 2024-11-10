const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    amount: {
      type: String, // You can change this to a Number if you're storing amounts in numerical format
      required: true,
    },
    deadline: {
      type: Date,
      required: true,
    },
    targetAmount: {
      type: Number,
      required: true,
    },
    location: {
      country: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
    },
    profilePicture: {
      type: String, // This could store a URL or a file path to the uploaded image
    },
    organizerContact: {
      type: String,
      required: true,
    },
    socialMediaLinks: {
      type: [String], // Array of URLs
    },
    campaignType: {
      type: String,
      enum: ["Non-Profit", "Commercial", "Personal", "Government"], // Example options
      required: true,
      default: 'Personal'
    },
    organizationName: {
      type: String,
      required: true,
    },
    organizationEmail: {
      type: String,
      required: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    contactPersonName: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "completed"],
      default: "active",
    },
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
  }
);

module.exports = mongoose.model("Campaign", campaignSchema);
