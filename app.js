const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const connectDB = require("./config/db");
const errorHandler = require("./middlewares/errorHandler");
const apiLimiter = require("./middlewares/rateLimiter");


const authRoutes = require("./routes/authRoutes");

require("dotenv").config();
connectDB();

const app = express();
const memberRoutes = require("./routes/memberRoutes");
const loanRoutes = require("./routes/loanRoutes");
const savingsRoutes = require("./routes/savingsRoutes");
const reportRoutes = require("./routes/reportRoutes");


app.use("/api/members", memberRoutes);
app.use("/api/loans", loanRoutes);
app.use("/api/savings", savingsRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api", apiLimiter);
app.use(errorHandler);





app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(bodyParser.json());

// Routes
app.use("/api/auth", authRoutes);

app.use((req, res) => res.status(404).json({ error: "Route not found!" }));

module.exports = app;
