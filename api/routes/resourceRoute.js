const express = require("express");
const { registerResource } = require("../controllers/resourceController");
const multer = require("multer");

const router = express.Router();
const upload = require('./mult'); // Adjust path as needed

// Route to register a resource
router.post('/register-resource', upload.fields([{ name: 'identity' }, { name: 'certificate' }]), registerResource);

module.exports = router;
