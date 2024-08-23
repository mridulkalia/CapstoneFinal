const express = require("express");
const {
  registerResource,
  getResource,
  updateResourceStatus,
} = require("../controllers/resourceController");
const multer = require("multer");

const router = express.Router();
const upload = require("./mult"); // Adjust path as needed

// Route to register a resource
router.post(
  "/register-resource",
  upload.fields([{ name: "identity" }, { name: "certificate" }]),
  registerResource
);
router.put("/resources/:id/status", updateResourceStatus);
router.get("/resources", getResource);

module.exports = router;
