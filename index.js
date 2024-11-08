const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const UserModel = require("./model");
dotenv.config();

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 2311;
const MONGO_URI = process.env.MONGO_URI;
const dbUri = `mongodb+srv://tmtrung21:GWjD0paXPELA7zIF@auth-api.phykt.mongodb.net/test?retryWrites=true&w=majority`;

mongoose
  .connect(dbUri)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("Error connecting to MongoDB Atlas:", err));

app
  .get("/profile", async (req, res) => {
    try {
      const userData = await UserModel.findById("672e10fc9f4d3f8d49cad3ec");
      console.log(userData);
      res.status(200).json(userData);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server error", error });
    }
  })
  .post("/register", async (req, res) => {
    try {
      const { name, email, password } = req.body;
      const existedUser = await UserModel.findOne({ email });

      if (existedUser) {
        return res.status(422).json({ msg: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await UserModel.create({
        name,
        email,
        password: hashedPassword,
      });

      res.status(200).json({ msg: "User created successfully", data: newUser });
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ msg: "Server error", error });
    }
  })
  .post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      const foundUser = await UserModel.findOne({ email });

      if (!foundUser) {
        return res.status(401).json({ msg: "Invalid email" });
      }

      const passwordMatch = await bcrypt.compare(password, foundUser.password);

      if (!passwordMatch) {
        return res.status(401).json({ msg: "Invalid password" });
      }

      res.status(200).json({ msg: "Login successful" });
    } catch (error) {
      console.error("Error logging in:", error);
      res.status(500).json({ msg: "Internal server error" });
    }
  });

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

module.exports = app;
