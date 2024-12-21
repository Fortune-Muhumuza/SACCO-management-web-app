const Savings = require("../models/Savings");

exports.addSavings = async (req, res) => {
  try {
    const { memberId, amount } = req.body;

    const savings = new Savings({ memberId, amount });
    await savings.save();

    res.status(201).json({ message: "Savings added successfully!", savings });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSavings = async (req, res) => {
  try {
    const savings = await Savings.find().populate("memberId", "firstName lastName email");
    res.status(200).json(savings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
