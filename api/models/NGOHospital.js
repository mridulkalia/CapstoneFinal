const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Import the Inventory Schema to reference it later
const Inventory = require("./inventorySchema");

const NGOHospitalSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  registrationNumber: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
  },
  phone: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  contactPerson: {
    type: String,
    required: true,
  },
  contactPersonPhone: {
    type: String,
    required: true,
  },
  certificate: {
    type: String,
  },
  description: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  password: { 
    type: String 
  },

  // Reference to the inventory associated with this hospital
  inventory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Inventory',
  },

  // Inventory score (this can be calculated dynamically based on inventory data)
  inventoryScore: {
    type: Number,
    default: 0,
  },
  
  // Add a field for total inventory value if needed (optional, based on your use case)
  totalInventoryValue: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("NGOHospital", NGOHospitalSchema);
