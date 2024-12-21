const Member = require("../models/Member");
const Loan = require("../models/Loan");
const Savings = require("../models/Savings");

exports.generateReport = async (req, res) => {
  try {
    const membersCount = await Member.countDocuments();
    const totalSavings = await Savings.aggregate([{ $group: { _id: null, total: { $sum: "$amount" } } }]);
    const totalLoans = await Loan.aggregate([{ $group: { _id: null, total: { $sum: "$loanAmount" } } }]);

    const report = {
      membersCount,
      totalSavings: totalSavings[0]?.total || 0,
      totalLoans: totalLoans[0]?.total || 0,
    };

    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const generateAdvancedReport = async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
  
      const filter = {};
      if (startDate || endDate) {
        filter.date = {};
        if (startDate) filter.date.$gte = new Date(startDate);
        if (endDate) filter.date.$lte = new Date(endDate);
      }
  
      const membersCount = await Member.countDocuments(filter);
      const totalSavings = await Savings.aggregate([
        { $match: filter },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]);
      const totalLoans = await Loan.aggregate([
        { $match: filter },
        { $group: { _id: null, total: { $sum: "$loanAmount" } } },
      ]);
  
      const report = {
        membersCount,
        totalSavings: totalSavings[0]?.total || 0,
        totalLoans: totalLoans[0]?.total || 0,
      };
  
      res.status(200).json(report);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  


