const NGOHospital = require("../models/NGOHospital");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const inventorySchema = require("../models/inventorySchema");

exports.addNGOHospital = async (req, res) => {
  try {
    const {
      name,
      registrationNumber,
      email,
      phone,
      address,
      contactPerson,
      contactPersonPhone,
      description,
      city,
      country,
    } = req.body;

    const existingOrg = await NGOHospital.findOne({
      $or: [{ registrationNumber }, { email }],
    });

    if (existingOrg) {
      return res.status(400).json({
        message:
          "An organization with this registration number or email already exists",
      });
    }
    const certificateFile = req.file;
    // if (!certificateFile) {
    //   return res.status(400).json({ message: 'Certificate is required' });
    // }
    const newNGOHospital = new NGOHospital({
      name,
      registrationNumber,
      email,
      phone,
      address,
      contactPerson,
      contactPersonPhone,
      city,
      country,
      //   certificate: certificateFile.filename,
      description,
    });

    await newNGOHospital.save();
    res.status(201).json({
      message: "NGO/Hospital submitted for review",
      data: newNGOHospital,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while adding the organization" });
  }
};

// Fetch all NGO/Hospital organizations for admin review
exports.getNGOHospitalList = async (req, res) => {
  try {
    const organizations = await NGOHospital.find({ status: "pending" });
    res.status(200).json({ data: organizations });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching the organizations" });
  }
};

exports.updateNGOHospitalStatus = async (req, res) => {
  try {
    const { id, status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    const organization = await NGOHospital.findById(id);
    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }
    let password = ""; // Define password variable
    if (status === "approved") {
      password = crypto.randomBytes(8).toString("hex");
      const hashedPassword = await bcrypt.hash(password, 10);
      organization.password = hashedPassword;
    }
    organization.status = status;
    await organization.save();

    if (status === "approved") {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER, // Use environment variables
          pass: process.env.EMAIL_PASS, // Use environment variables
        },
      });
      await transporter.sendMail({
        from: "your-email@example.com",
        to: organization.email,
        subject: "Your Account has been Approved",
        text: `Congratulations! Your account has been approved. Here are your login credentials:\n\nUsername: ${organization.email}\nPassword: ${password}`,
      });
    }

    res
      .status(200)
      .json({ message: `Organization ${status}`, data: organization });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while updating the status" });
  }
};

exports.loginNGOHospital = async (req, res) => {
  try {
    const { email, registrationNumber, password } = req.body;

    // Validate input
    if (!email || !registrationNumber || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Find organization by email and registration number
    const organization = await NGOHospital.findOne({
      email,
      registrationNumber,
    });

    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, organization.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // If successful, return user information
    res.status(200).json({
      message: "Login successful",
      organization: {
        id: organization._id,
        name: organization.name,
        email: organization.email,
        registrationNumber: organization.registrationNumber,
        city: organization.city,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "An error occurred during login" });
  }
};

const priorityMapping = {
  High: 3,
  Moderate: 2,
  Low: 1,
};

exports.updateInventory = async (req, res) => {
  try {
    const { registrationNumber, inventoryData } = req.body; // Registration number and inventory data

    // Step 1: Validate the incoming data
    if (
      !registrationNumber ||
      !Array.isArray(inventoryData) ||
      inventoryData.length === 0
    ) {
      return res.status(400).json({
        message:
          "Invalid data. Please provide registrationNumber and a valid inventoryData array.",
      });
    }

    // Step 2: Find the hospital by registration number
    const hospital = await NGOHospital.findOne({ registrationNumber });
    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    // Step 3: Define item priority, category weights, and calculate the total score
    const priorityMapping = {
      high: 10,
      medium: 5,
      low: 2,
    };

    const categoryWeights = {
      medicalEquipment: 3,
      oxygenSupplies: 2,
      other: 1,
    };

    const inventoryItems = [];
    let totalScore = 0;

    for (const item of inventoryData) {
      // Validate individual item
      if (
        !item.itemName ||
        !item.category ||
        !item.quantity ||
        !item.unit ||
        !item.condition
      ) {
        return res.status(400).json({
          message:
            "Each item must have itemName, category, quantity, unit, and condition.",
        });
      }

      // Ensure priority is valid and assign score
      const priority = priorityMapping[item.priority] || 0; // Default to 0 if priority is not recognized

      // Ensure category weight is valid
      const categoryWeight = categoryWeights[item.category.toLowerCase()] || 1; // Default to 1 if category is not recognized

      // Calculate quantity score (based on quantity and category weight)
      const quantityScore = item.quantity * categoryWeight;

      // Calculate the total score for the item (priority + quantity score)
      const itemScore = priority + quantityScore;

      // Prepare the inventory item
      const inventoryItem = {
        itemName: item.itemName,
        category: item.category,
        quantity: item.quantity,
        unit: item.unit,
        condition: item.condition,
        additionalDetails: item.additionalDetails || "",
        weightOrVolume: item.weightOrVolume || "",
        purchaseDate: item.purchaseDate || null,
        cost: item.cost || 0,
        priority: priority, // Store numeric priority for easier calculation
        categoryWeight: categoryWeight,
        quantityScore: quantityScore,
        itemScore: itemScore, // Store the individual item score
      };

      inventoryItems.push(inventoryItem);
      totalScore += itemScore; // Add the item's score to the total score
    }

    // Step 4: Create or update the hospital's inventory in the database
    const updatedInventory = await inventorySchema.create({
      registrationNumber: hospital.registrationNumber,
      items: inventoryItems,
      totalScore: totalScore,
    });

    // Step 5: Update the hospital with the new inventory and score
    hospital.inventory = updatedInventory._id;
    hospital.inventoryScore = totalScore;
    await hospital.save();

    // Step 6: Respond to the client
    res.status(200).json({
      message: "Inventory updated and score calculated successfully.",
      data: updatedInventory,
    });
  } catch (error) {
    console.error("Error updating inventory:", error);
    res
      .status(500)
      .json({ message: "An error occurred while updating the inventory." });
  }
};
