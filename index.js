const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { authenticateToken } = require("./jwt");
const controller = require("./ctrler");

const app = express();

dotenv.config();
app.use(express.json());

const PORT = process.env.PORT || 2311;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("Error connecting to MongoDB Atlas:", err));

app
  .get("/profile", authenticateToken, controller.getMe)
  .post("/register", controller.register)
  .post("/login", controller.login);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

module.exports = app;
