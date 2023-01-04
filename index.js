const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authController = require("./controllers/authController");
const userController = require("./controllers/userController");
const ConversationRouter = require("./controllers/conversationController");
const messageController = require("./controllers/messageController");
require("dotenv").config();

const app = express();

mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGO_URL, () => {
  console.log("DB is connected successfully");
});

//middlewares
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

//routes
app.use("/auth", authController);
app.use("/user", userController);
app.use("/conversation", ConversationRouter);
app.use("/message", messageController);

app.listen(process.env.PORT || 5000, () => {
  console.log("Server is successfully started");
});
