const verifyToken = require("../middleware/verifyToken");

const Conversation = require("../models/Conversation");
const ConversationRouter = require("express").Router();

//create  conversation
ConversationRouter.post("/", verifyToken, async (req, res) => {
  try {
    const { receiverId } = req.body;
    const currentUserId = req.user.id;
    const isConvoAlreadyCreated = await Conversation.findOne({
      members: { $all: [currentUserId, receiverId] }, //members array has a conversation with both current user and receiver
    });
    if (isConvoAlreadyCreated) {
      return res
        .status(500)
        .json({ message: "There is already such conversation already" });
    } else {
      await Conversation.create({ members: [currentUserId, receiverId] });
      return res
        .status(201)
        .json({ message: "Conversation is successfully created" });
    }
  } catch (error) {
    console.log(error);
  }
});
//get user conversation with ID
ConversationRouter.get("/find/:userId", verifyToken, async (req, res) => {
  if (req.user.id === req.params.userId) {
    try {
      const currentUserId = req.user.id;
      const conversations = await Conversation.find({
        members: { $in: [currentUserId] },
      }); //array includes current user id
      return res.status(200).json(conversations);
    } catch (error) {
      console.log(error);
    }
  } else {
    return res
      .status(403)
      .json({ message: "You are not authorized to view this conversation" });
  }
});

//get a signle conversation
ConversationRouter.get("/:convoId", verifyToken, async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.convoId);
    if (conversation.members.includes(req.user.id)) {
      return res.status(200).json(conversation);
    } else {
      return res
        .status(403)
        .json({ message: "This conversation does not include you" });
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = ConversationRouter;
