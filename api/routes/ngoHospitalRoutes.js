// routes/ngoHospitalRoutes.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const { addNGOHospital, getNGOHospitalList, updateNGOHospitalStatus, loginNGOHospital } = require('../controllers/ngoHospitalController');

const router = express.Router();

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/certificates');  // Directory to store certificates
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  }
});

const upload = multer({ storage });

// Route to add a new NGO/Hospital with certificate upload
router.post('/add-ngo-hospital', upload.single('certificate'), addNGOHospital);

// Route to get all pending NGO/Hospitals (for admin)
router.get('/get-ngo-hospital-list', getNGOHospitalList);

// Route to approve/reject NGO/Hospital
router.post('/update-ngo-hospital-status', updateNGOHospitalStatus);

router.post('/login-hospital', loginNGOHospital);

module.exports = router;
