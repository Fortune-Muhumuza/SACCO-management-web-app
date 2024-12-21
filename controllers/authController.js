const User = require("../models/User");
const { generateToken } = require("../utils/jwtUtils");

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const user = new User({ name, email, password, role });
    await user.save();

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: "Invalid credentials!" });
    }

    const token = generateToken({ id: user._id, role: user.role });
    res.status(200).json({ token, user: { name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
