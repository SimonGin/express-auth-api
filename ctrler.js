const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const UserModel = require("./model");
const SECRET_KEY = process.env.JWT_SECRET_KEY;

dotenv.config();

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existedUser = await UserModel.findOne({ email });

    if (existedUser) {
      return res.status(422).json({ status: 422, msg: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await UserModel.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(200).json({
      status: 200,
      msg: "User created successfully",
      metadata: { user: newUser },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ status: 500, msg: "Server error", error });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const foundUser = await UserModel.findOne({ email });

    if (!foundUser) {
      return res.status(401).json({ status: 401, msg: "Invalid email" });
    }

    const passwordMatch = await bcrypt.compare(password, foundUser.password);

    if (!passwordMatch) {
      return res.status(401).json({ status: 401, msg: "Invalid password" });
    }

    const token = jwt.sign(
      { id: foundUser._id, email: foundUser.email },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      status: 200,
      msg: "Login successful",
      metadata: { access_token: token },
    });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ status: 500, msg: "Internal server error" });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    res.status(200).json({
      status: 200,
      msg: "User data retrieved",
      metadata: { user: user },
    });
  } catch (error) {
    res.status(500).json({ status: 500, msg: "Internal server error" });
  }
};
