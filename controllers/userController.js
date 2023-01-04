const User = require("../models/User");

const userController = require("express").Router();

//find user by id
userController.get("/find/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...others } = user._doc; //destructure user object

    return res.status(200).json(others);
  } catch (error) {
    console.log(error);
  }
});

module.exports = userController;
