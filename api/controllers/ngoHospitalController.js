// controllers/ngoHospitalController.js
const NGOHospital = require('../models/NGOHospital');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');


exports.addNGOHospital = async (req, res) => {
  try {
    const { name, registrationNumber, email, phone, address, contactPerson, contactPersonPhone, description , city , country  } = req.body;

    const existingOrg = await NGOHospital.findOne({ 
      $or: [{ registrationNumber }, { email }]
    });

    if (existingOrg) {
      return res.status(400).json({ message: 'An organization with this registration number or email already exists' });
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
      contactPersonPhone, city , country ,
    //   certificate: certificateFile.filename,  
      description,
    });

    await newNGOHospital.save();
    res.status(201).json({ message: 'NGO/Hospital submitted for review', data: newNGOHospital });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while adding the organization' });
  }
};

// Fetch all NGO/Hospital organizations for admin review
exports.getNGOHospitalList = async (req, res) => {
  try {
    const organizations = await NGOHospital.find({ status: 'pending' });
    res.status(200).json({ data: organizations });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while fetching the organizations' });
  }
};

// controllers/ngoHospitalController.js
const nodemailer = require('nodemailer');
const crypto = require('crypto');


exports.updateNGOHospitalStatus = async (req, res) => {
    try {
      const { id, status } = req.body;
  
      if (!['approved', 'rejected'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
      }
      const organization = await NGOHospital.findById(id);
      if (!organization) {
        return res.status(404).json({ message: 'Organization not found' });
      }
      let password = ''; // Define password variable
      if (status === 'approved') {
          password = crypto.randomBytes(8).toString('hex');
          const hashedPassword = await bcrypt.hash(password, 10);
          organization.password = hashedPassword;
      }
      organization.status = status;
      await organization.save();
  
      if (status === 'approved') {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER, // Use environment variables
            pass: process.env.EMAIL_PASS, // Use environment variables
          },
        });
          await transporter.sendMail({
          from: 'your-email@example.com',
          to: organization.email,
          subject: 'Your Account has been Approved',
          text: `Congratulations! Your account has been approved. Here are your login credentials:\n\nUsername: ${organization.email}\nPassword: ${password}`,
        });
      }
  
      res.status(200).json({ message: `Organization ${status}`, data: organization });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred while updating the status' });
    }
  };

  exports.loginNGOHospital = async (req, res) => {
    try {
      const { email, registrationNumber, password } = req.body;
  
      // Validate input
      if (!email || !registrationNumber || !password) {
        return res.status(400).json({ message: 'All fields are required' });
      }
  
      // Find organization by email and registration number
      const organization = await NGOHospital.findOne({ email, registrationNumber });
  
      if (!organization) {
        return res.status(404).json({ message: 'Organization not found' });
      }
  
      // Compare passwords
      const isMatch = await bcrypt.compare(password, organization.password);
  
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      // If successful, return user information
      res.status(200).json({ 
        message: 'Login successful', 
        organization: {
          id: organization._id,
          name: organization.name,
          email: organization.email,
          registrationNumber: organization.registrationNumber
        } 
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'An error occurred during login' });
    }
  };
  