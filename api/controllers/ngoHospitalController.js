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
<<<<<<< HEAD
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
      return res
        .status(400)
        .json({
          message:
            "Invalid data. Please provide registrationNumber and a valid inventoryData array.",
        });
    }

    // Step 2: Find the hospital by registration number
    const hospital = await NGOHospital.findOne({ registrationNumber });
    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    // Step 3: Find or create the existing inventory
    let existingInventory = await inventorySchema.findOne({
      registrationNumber,
    });
    if (!existingInventory) {
      existingInventory = new inventorySchema({
        registrationNumber,
        items: [],
        totalScore: 0,
      });
    }
=======
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
>>>>>>> 8d833baca5cb1d1c513e2e606135c13533c87fb6
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

<<<<<<< HEAD
    const conditionImpact = {
      new: 1.2,
      used: 1,
      damaged: 0.5,
    };

=======
>>>>>>> 8d833baca5cb1d1c513e2e606135c13533c87fb6
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
<<<<<<< HEAD
      const priority = priorityMapping[item.priority] || 0; // Default to 0 if priority is not recognized
      const categoryWeight = categoryWeights[item.category.toLowerCase()] || 1; // Default to 1 if category is not recognized
      const conditionMultiplier =
        conditionImpact[item.condition.toLowerCase()] || 1; // Default to 1 if condition is not recognized
      const quantityScore =
        item.quantity * categoryWeight * conditionMultiplier;
      const itemScore = priority + quantityScore;
=======

      // Ensure priority is valid and assign score
      const priority = priorityMapping[item.priority] || 0; // Default to 0 if priority is not recognized

      // Ensure category weight is valid
      const categoryWeight = categoryWeights[item.category.toLowerCase()] || 1; // Default to 1 if category is not recognized

      // Calculate quantity score (based on quantity and category weight)
      const quantityScore = item.quantity * categoryWeight;

      // Calculate the total score for the item (priority + quantity score)
      const itemScore = priority + quantityScore;

      // Prepare the inventory item
>>>>>>> 8d833baca5cb1d1c513e2e606135c13533c87fb6
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
<<<<<<< HEAD
        conditionMultiplier: conditionMultiplier,
=======
>>>>>>> 8d833baca5cb1d1c513e2e606135c13533c87fb6
        quantityScore: quantityScore,
        itemScore: itemScore, // Store the individual item score
      };

      inventoryItems.push(inventoryItem);
      totalScore += itemScore; // Add the item's score to the total score
    }
<<<<<<< HEAD
    existingInventory.items = inventoryItems;
    existingInventory.totalScore = totalScore;
    await existingInventory.save();

    hospital.inventory = existingInventory._id;
    hospital.inventoryScore = totalScore;
    await hospital.save();

    // Step 7: Respond to the client
    res.status(200).json({
      message: "Inventory updated and score calculated successfully.",
      data: existingInventory,
=======

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
>>>>>>> 8d833baca5cb1d1c513e2e606135c13533c87fb6
    });
  } catch (error) {
    console.error("Error updating inventory:", error);
    res
      .status(500)
      .json({ message: "An error occurred while updating the inventory." });
  }
};
<<<<<<< HEAD

exports.getInventory = async (req, res) => {
  try {
    const { registrationNumber } = req.params;
    console.log("Requested Registration Number:", registrationNumber);  // Debugging line

    // Find the inventory based on the hospital's registration number
    const inventory = await inventorySchema.findOne({
      registrationNumber: registrationNumber,
    });

    if (!inventory) {
      return res.status(404).json({ message: "Inventory not found for this hospital" });
    }

    // Return the full inventory details for the specified registration number
    return res.status(200).json({ inventoryItems: inventory.items });
  } catch (error) {
    console.error(error); // Log error for debugging
    return res.status(500).json({ message: "Server error while fetching inventory", error });
  }
};

exports.getAllHospitals = async (req, res) => {
  try {
    const { sortBy, filterBy, filterValue, page = 1, pageSize = 10 } = req.query;

    let query = {};
    if (filterBy && filterValue) {
      query[filterBy] = filterValue;
    }

    // Implement pagination and sorting
    const hospitals = await NGOHospital.find(query)
      .sort(sortBy ? { [sortBy]: 1 } : {}) // Sort dynamically
      .skip((page - 1) * pageSize)
      .limit(parseInt(pageSize));

    const totalHospitals = await NGOHospital.countDocuments(query);
    const totalPages = Math.ceil(totalHospitals / pageSize);

    res.status(200).json({ hospitals, totalPages });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching hospitals', error });
  }
};

=======
>>>>>>> 8d833baca5cb1d1c513e2e606135c13533c87fb6
