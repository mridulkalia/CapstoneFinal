const mongoose = require("mongoose");

const ResourceSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  location: { type: String, required: true },
  resourceType: { type: String, required: true },
  identity: { type: String },
  certificate: { type: String },
  additionalInfo: { type: String },
  emergencyContactName: { type: String },
  emergencyContactPhone: { type: String },
  experience: { type: String },
  socialMedia: { type: String },
  agreeToTerms: { type: Boolean, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // Linking with User
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Resource", ResourceSchema);
