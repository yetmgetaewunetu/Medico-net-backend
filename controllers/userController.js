const bcrypt = require("bcrypt");

const { default: authmiddleware } = require("../middleware/authmiddleware");
const User = require("../models/User");
const generateToken = require("../lib/utils");

const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ msg: "user doesn't exist" });
    }

    const isUser = await bcrypt.compare(password, user.password);

    if (!isUser || user.role != role) {
      return res.status(404).json({ msg: "invalid credentials" });
    }

    generateToken(user._id, user.hospitalId, user.role, res);

    res.status(200).json({
      userId: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      gender: user.gender,
    });
  } catch (error) {
    console.log("error in login", error.message);
    res.status(500).json({
      msg: "Internal server error",
    });
  }
};

module.exports = { login };
