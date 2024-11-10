const express = require("express");
const {
  createCampaign,
  getAllCampaigns,
} = require("../controllers/campaignController");

const router = express.Router();
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

const upload = multer({ storage: storage });

// POST route for creating a new campaign
router.post(
  "/campaign/create",
  upload.single("profilePicture"),
  createCampaign
);

// GET route for fetching all campaigns
router.get("/campaigns", getAllCampaigns);

module.exports = router;
