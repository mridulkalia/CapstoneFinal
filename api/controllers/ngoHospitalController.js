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
        from: "crisis_chain@gmail.com",
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

    const conditionImpact = {
      new: 1.2,
      used: 1,
      damaged: 0.5,
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
      const priority = priorityMapping[item.priority] || 0; // Default to 0 if priority is not recognized
      const categoryWeight = categoryWeights[item.category.toLowerCase()] || 1; // Default to 1 if category is not recognized
      const conditionMultiplier =
        conditionImpact[item.condition.toLowerCase()] || 1; // Default to 1 if condition is not recognized
      const quantityScore =
        item.quantity * categoryWeight * conditionMultiplier;
      const itemScore = priority + quantityScore;
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
        conditionMultiplier: conditionMultiplier,
        quantityScore: quantityScore,
        itemScore: itemScore, // Store the individual item score
      };

      inventoryItems.push(inventoryItem);
      totalScore += itemScore; // Add the item's score to the total score
    }
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
    });
  } catch (error) {
    console.error("Error updating inventory:", error);
    res
      .status(500)
      .json({ message: "An error occurred while updating the inventory." });
  }
};

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
// exports.getAllHospitals = async (req, res) => {
//   try {
//     const { sortBy, filterBy, filterValue, page = 1, pageSize = 10 } = req.query;
//     console.log('Incoming Request:', req.query);


//     // Log the query parameters to verify if sortBy is being passed correctly
//     console.log("Request Query Parameters:", req.query);

//     // Initialize the query object
//     let query = {};

//     // Apply filter if provided
//     if (filterBy && filterValue) {
//       if (filterBy === 'registrationNumber') {
//         query[filterBy] = filterValue; // Exact match for registration number
//       } else {
//         query[filterBy] = { $regex: filterValue, $options: 'i' }; // Case-insensitive partial match
//       }
//     }

//     // Handle status filter for pending or approved
//     if (filterBy === 'status' && filterValue) {
//       query['status'] = filterValue; // Filter by status (approved/pending)
//     }

//     // Implement sorting based on sortBy
//     let sort = {};
//     if (sortBy) {
//       const [field, order] = sortBy.split('_');
//       if (field === 'inventoryScore') {
//         // Ensure sorting inventoryScore as numeric
//         sort['inventoryScore'] = order === 'desc' ? -1 : 1; // Sorting in ascending/descending order
//       } else {
//         sort[field] = order === 'desc' ? -1 : 1; // Default sorting for other fields
//       }
//     }

//     // Fetch hospitals with sorting, filtering, pagination
//     const hospitals = await NGOHospital.find(query)
//     .sort({ inventoryScore: sort.inventoryScore }) // Directly sort by inventoryScore
//     .skip((page - 1) * pageSize)
//     .limit(parseInt(pageSize));

//     console.log('Before Sorting:', hospitals);
//     hospitals.sort((a, b) => a.inventoryScore - b.inventoryScore); // Manual sort to see if issue persists
//     console.log('After Manual Sorting:', hospitals);

//     // Check if hospitals are returned correctly

//     // Log the inventoryScore of each hospital for verification
//     if (sortBy && sortBy.includes('inventoryScore')) {
//       console.log('Sorted Hospitals by Inventory Score:');
//       hospitals.forEach(hospital => {
//         // console.log(Hospital: ${hospital.name}, Inventory Score: ${hospital.inventoryScore}, Type: ${typeof hospital.inventoryScore});
//       });
//     }

//     // Get total hospitals count for pagination
//     const totalHospitals = await NGOHospital.countDocuments(query);
//     const totalPages = Math.ceil(totalHospitals / pageSize);

//     res.status(200).json({ hospitals, totalPages });
//   } catch (error) {
//     console.error('Error fetching hospitals:', error);
//     res.status(500).json({ message: 'Error fetching hospitals', error });
//   }
// };
exports.getAllHospitals = async (req, res) => {
  try {
    const { sortBy, filterBy, filterValue, page = 1, pageSize = 10 } = req.query;
    // console.log('Incoming Request:', req.query);

    // Log the query parameters to verify if `sortBy` is being passed correctly
    // console.log("Request Query Parameters:", req.query);

    // Initialize the query object
    let query = {};

    // Apply filter if provided
    if (filterBy && filterValue) {
      if (filterBy === 'registrationNumber') {
        query[filterBy] = filterValue; // Exact match for registration number
      } else {
        query[filterBy] = { $regex: filterValue, $options: 'i' }; // Case-insensitive partial match
      }
    }

    // Handle status filter for `pending` or `approved`
    if (filterBy === 'status' && filterValue) {
      query['status'] = filterValue; // Filter by status (approved/pending)
    }

    // Implement sorting based on sortBy
    let sort = {};
    if (sortBy) {
      const [field, order] = sortBy.split('_');
      if (field) {
        sort[field] = order === 'desc' ? -1 : 1; // Ensure valid sort order
      }
    }

    // Only apply `sort()` if the `sort` object has valid keys
    const hospitalsQuery = NGOHospital.find(query);
    if (Object.keys(sort).length > 0 && sort[Object.keys(sort)[0]] !== undefined) {
      hospitalsQuery.sort(sort);
    }

    const hospitals = await hospitalsQuery
      .skip((page - 1) * pageSize)
      .limit(parseInt(pageSize, 10));

    // console.log('Before Sorting:', hospitals);
    hospitals.sort((a, b) => a.inventoryScore - b.inventoryScore); // Manual sort to see if issue persists
    // console.log('After Manual Sorting:', hospitals);

    // Check if hospitals are returned correctly
    if (sortBy && sortBy.includes('inventoryScore')) {
      // console.log('Sorted Hospitals by Inventory Score:');
      hospitals.forEach(hospital => {
        // console.log(`Hospital: ${hospital.name}, Inventory Score: ${hospital.inventoryScore}, Type: ${typeof hospital.inventoryScore}`);
      });
    }

    // Get total hospitals count for pagination
    const totalHospitals = await NGOHospital.countDocuments(query);
    const totalPages = Math.ceil(totalHospitals / pageSize);

    res.status(200).json({ hospitals, totalPages });
  } catch (error) {
    console.error('Error fetching hospitals:', error);
    res.status(500).json({ message: 'Error fetching hospitals', error });
  }
};



exports.contactHospital = async (req, res) => {
  try {
    const { hospitalEmail, message } = req.body;

    // Check if message exists in the request body
    if (!message || message.trim() === "") {
      return res.status(400).json({ message: "Message cannot be empty" });
    }

    // Find the hospital by email (hospitalEmail passed in the body)
    const hospital = await NGOHospital.findOne({ email: hospitalEmail });
    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    // Create a transport for sending email
    const transporter = nodemailer.createTransport({
      service: "gmail", // You can change this to another email service
      auth: {
        user: process.env.EMAIL_USER, // Use environment variables
        pass: process.env.EMAIL_PASS, // Use environment variables
      },
    });

    // Send the email to the hospital
    await transporter.sendMail({
      from: process.env.EMAIL_USER, // Your email address
      to: hospital.email, // The hospital's email address
      subject: "Contact Us - New Message",
      text: `You have received a new message from the 'Contact Us' form. Here is the message:\n\n${message}`,
    });

    // Respond with a success message
    res.status(200).json({ message: "Message sent successfully to the hospital." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while sending the message." });
  }
};


