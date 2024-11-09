const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { authenticateToken } = require("./jwt");
const controller = require("./ctrler");

dotenv.config();
const app = express();

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

// CORS configuration (apply before express.json)
app.use(
  cors({
    origin: "https://fluffy-auth-client.vercel.app",
    credentials: true,
  })
);

app.use(express.json()); // Body parsing middleware

// MongoDB connection
const PORT = process.env.PORT || 2311;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("Error connecting to MongoDB Atlas:", err));

// Define routes
app
  .get("/profile", authenticateToken, controller.getMe)
  .post("/register", controller.register)
  .post("/login", controller.login);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

module.exports = app;
