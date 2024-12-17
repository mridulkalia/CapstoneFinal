const Disaster = require("../models/disasterSchema");

// Get all disasters
exports.getDisasters = async (req, res) => {
  try {
    const disasters = await Disaster.find();
    res.status(200).json(disasters);
  } catch (error) {
    res.status(500).json({ message: "Error fetching disasters", error });
  }
};

// Add a new disaster
exports.createDisaster = async (req, res) => {
  const { type, coordinates, city, description } = req.body;
  try {
    const newDisaster = new Disaster({ type, coordinates, city, description });
    await newDisaster.save();
    res.status(201).json(newDisaster);
  } catch (error) {
    res.status(500).json({ message: "Error creating disaster", error });
  }
};

// Update a disaster by ID
exports.updateDisaster = async (req, res) => {
  const { id } = req.params;
  const { type, coordinates, city, description } = req.body;
  try {
    const updatedDisaster = await Disaster.findByIdAndUpdate(
      id,
      { type, coordinates, city, description },
      { new: true }
    );
    if (!updatedDisaster) {
      return res.status(404).json({ message: "Disaster not found" });
    }
    res.status(200).json(updatedDisaster);
  } catch (error) {
    res.status(500).json({ message: "Error updating disaster", error });
  }
};

// Delete a disaster by ID
exports.deleteDisaster = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedDisaster = await Disaster.findByIdAndDelete(id);
    if (!deletedDisaster) {
      return res.status(404).json({ message: "Disaster not found" });
    }
    res.status(200).json({ message: "Disaster deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting disaster", error });
  }
};

exports.checkCityAlert = async (req, res) => {
  const { city } = req.query;

  try {
    const alert = await Disaster.findOne({ city });
    if (alert) {
      res
        .status(200)
        .json({ alertActive: true, alertMessage: alert.description });
    } else {
      res.status(200).json({ alertActive: false });
    }
  } catch (error) {
    res.status(500).json({ message: "Error checking city alert", error });
  }
};
