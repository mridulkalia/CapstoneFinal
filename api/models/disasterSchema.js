// models/Disaster.js
const mongoose = require("mongoose");

const DisasterSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ["flood", "fire", "pandemic", "earthquake", "other"], // Add more types as needed
  },
  coordinates: {
    type: [Number],
    required: true,
    validate: {
      validator: function (val) {
        return val.length === 2;
      },
      message:
        "Coordinates should contain exactly two numbers (latitude, longitude).",
    },
  },
  description: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Disaster", DisasterSchema);
