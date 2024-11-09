const mongoose = require('mongoose');

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
    socialLinks: [
      {
        platform: { 
          type: String, 
          enum: ['Facebook', 'Whatsapp', 'LinkedIn', 'Twitter', 'Youtube', 'Other'] 
        },
        link: { type: String, required: true },
      },
    ],
    profilePicture: {
      type: String, // This could store a URL or a file path to the uploaded image
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'completed'],
      default: 'active',
    },
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
  }
);

module.exports = mongoose.model('Campaign', campaignSchema);
