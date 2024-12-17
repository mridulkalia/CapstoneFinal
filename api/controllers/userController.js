const User = require("../models/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const register = async (req, res) => {
  //register end point
  const { name, email, password } = req.body;
  const nameCheck = await User.findOne({ name });
  if (nameCheck) {
    return res.json({ msg: "Username already registered", status: false });
  }
  const emailCheck = await User.findOne({ email });
  if (emailCheck) {
    return res.json({ msg: "Email already used", status: false });
  }
  const hashPassword = await bcrypt.hash(password, 10);
  try {
    const newUser = await User.create({
      name,
      email,
      password: hashPassword,
    });
    return res.status(200).json(newUser, { msg: "User created", status: true });
  } catch (error) {
    res.status(422).json(error);
  }
};

const login = async (req, res) => {
  console.log("Login request received:", req.body);
  const { email, password, profile } = req.body;

  try {
    // Fixed admin credentials
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (
      profile === "admin" &&
      email === adminEmail &&
      password === adminPassword
    ) {
      const token = jwt.sign(
        {
          email: adminEmail,
          id: "admin",
          profile: "admin",
        },
        process.env.SECRET,
        { expiresIn: "1h" }
      );
      res
        .cookie("token", token)
        .json({ email: adminEmail, profile: "admin", token });
      return;
    }
    // Regular user login
    const userCheck = await User.findOne({ email });
    console.log("User found:", userCheck);

    if (!userCheck) {
      return res.json({ msg: "User not found", status: false });
    }

    const passok = await bcrypt.compare(password, userCheck.password);
    console.log("Password match:", passok);

    if (!passok) {
      return res.json({ msg: "Incorrect username or password", status: false });
    }

    // Check if the profile is admin and if so, ensure email matches
    if (profile === "admin") {
      if (email !== adminEmail) {
        return res.json({ msg: "Admin login failed", status: false });
      }
    }

    jwt.sign(
      {
        email: userCheck.email,
        id: userCheck._id,
        profile: userCheck.profile,
      },
      process.env.SECRET,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) {
          console.error("JWT error:", err);
          return res
            .status(500)
            .json({ msg: "Error signing token", status: false });
        }
        res.cookie("token", token).json({ ...userCheck._doc, token });
      }
    );
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ msg: "Internal server error", status: false });
  }
};

const getUserByEmail = async (req, res) => {
  try {
    const { email } = req.query;

    // Validate the email address
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Respond with user data, excluding sensitive information
    res.status(200).json({ userId: user._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while fetching user" });
  }
};
const logout = (req, res) => {
  res.cookie("token", "").json(true);
};

module.exports = { register, login, logout, getUserByEmail };
