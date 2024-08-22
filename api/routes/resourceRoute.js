const express = require("express");
const { registerResource } = require("../controllers/resourceController");

const router = express.Router();

// Route to register a resource
router.post("/register-resource", registerResource);

module.exports = router;
