const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const authController = require("express").Router();

//register user
authController.post("/register", async (req, res) => {
  try {
    if (
      req.body.username === "" ||
      req.body.email === "" ||
      req.body.password === ""
    ) {
      return res.status(500).json({ message: "Fill all fields!" });
    }
    const isExisting = await User.findOne({ email: req.body.email });
    if (isExisting) {
      return res.status(500).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(req.body.password.toString(), 10);
    const user = await User.create({ ...req.body, password: hashedPassword }); //reasign the password

    const { password, ...others } = user._doc;
    const token = createToken(user);

    return res.status(201).json({ token, others });
  } catch (error) {
    console.log(error);
  }
});

//login user
authController.post("/login", async (req, res) => {
  try {
    if (req.body.email === "" || req.body.password === "") {
      return res.status(500).json({ message: "Fill all fields!" });
    }
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(500).json({ message: "User not found" });
    }
    const comparePass = await bcrypt.compare(
      req.body.password.toString(),
      user.password
    );
    if (!comparePass) {
      return res.status(500).json({ message: "Wrong password" });
    }
    const { password, ...others } = user._doc;
    const token = createToken(others);
    return res.status(200).json({ token, others });
  } catch (error) {
    console.log(error);
  }
});

//generate token
const createToken = (user) => {
  const payload = {
    id: user._id.toString(),
    email: user.email,
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "6h" });
  return token;
};

module.exports = authController;
