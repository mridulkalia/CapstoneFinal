const Resource = require('../models/resource');
const User = require('../models/userSchema');  // Assuming User model is available

// Register Resource Controller
const registerResource = async (req, res) => {
  try {
    const { userId } = req.body;  // Assuming you send userId in request
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resourceData = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phone: req.body.phone,
      location: req.body.location,
      resourceType: req.body.resourceType,
      identity: req.files?.identity?.[0]?.path, // File upload handling
      certificate: req.files?.certificate?.[0]?.path, // File upload handling
      additionalInfo: req.body.additionalInfo,
      emergencyContactName: req.body.emergencyContactName,
      emergencyContactPhone: req.body.emergencyContactPhone,
      experience: req.body.experience,
      socialMedia: req.body.socialMedia,
      agreeToTerms: req.body.agreeToTerms,
      userId: user._id  // Assign the user ID to the resource
    };

    const newResource = new Resource(resourceData);
    await newResource.save();

    res.status(201).json({ message: 'Resource registered successfully', resource: newResource });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while registering resource' });
  }
};

module.exports = {
  registerResource
};
