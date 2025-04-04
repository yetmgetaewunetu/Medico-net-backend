const bcrypt = require("bcrypt");
const User = require("../models/User");
const generateToken = require("../lib/utils");

const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    
    // Validate input
    if (!email || !password || !role) {
      return res.status(400).json({ 
        success: false,
        msg: "Please provide email, password, and role" 
      });
    }

    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        msg: "User not found. Please check your email or register." 
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false,
        msg: "Invalid password. Please try again." 
      });
    }

    if (user.role !== role) {
      return res.status(403).json({ 
        success: false,
        msg: `Access denied. This account is not registered as a ${role}.` 
      });
    }

    generateToken(user._id, user.hospitalId, user.role, res);

    res.status(200).json({
      success: true,
      userId: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      gender: user.gender,
      role: user.role
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      msg: "Internal server error. Please try again later."
    });
  }
};

module.exports = { login };