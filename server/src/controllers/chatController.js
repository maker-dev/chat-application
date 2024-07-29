import ChatModel from '../models/Chat.js';
import UserModel from '../models/User.js';

//@description     Create or fetch One to One Chat
//@route           POST /api/chat/
//@access          Protected
const accessChat = async (req, res) => {
    const { userId } = req.body;

    if (!userId) return res.status(400).send({ message: "UserId param not sent with request" });

    var isChat = await ChatModel.find({
        isGroupChat: false,
        $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: userId } } },
        ]
    })
        .populate("users", "-password")
        .populate("latestMessage")
        
    isChat = await UserModel.populate(isChat, {
        path: "latestMessage.sender",
        select: "name pic email",
    });
    
    if (isChat.length > 0) {
        res.send(isChat[0]);
    } else {
        var chatData = {
        chatName: "sender",
        isGroupChat: false,
        users: [req.user._id, userId],
        };

        try {
        const createdChat = await ChatModel.create(chatData);
        const FullChat = await ChatModel.findOne({ _id: createdChat._id }).populate(
            "users",
            "-password"
        );
        res.status(200).json(FullChat);
        } catch (error) {
            res.status(400).send({ message: error.message });
        }
    }
};

//@description     Fetch all chats for a user
//@route           GET /api/chat/
//@access          Protected
const fetchChats = async (req, res) => {
    try {
        ChatModel.find({ users: { $elemMatch: { $eq: req.user._id } } })
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
        .populate("latestMessage")
        .sort({ updatedAt: -1 })
        .then(async (results) => {
            results = await UserModel.populate(results, {
            path: "latestMessage.sender",
            select: "name pic email",
            });
            res.status(200).send(results);
        });
    } catch (error) {
        res.status(400).send({ message: error.message })        
    }
};

//@description     Create New Group Chat
//@route           POST /api/chat/group
//@access          Protected
const createGroupChat = async (req, res) => {

    if (!req.body.users || !req.body.name) {
        return res.status(400).send({ message: "Please Fill all the fields" });
    }

    var users = JSON.parse(req.body.users);

    if (users.length < 2) {
        return res
            .status(400)
            .send({ message: "More than 2 users are required to form a group chat" });
    }

    users.push(req.user);

    try {
        const groupChat = await ChatModel.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user,
        });

        const fullGroupChat = await ChatModel.findOne({ _id: groupChat._id })
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

        res.status(200).json(fullGroupChat);

    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};


// @desc    Rename Group
// @route   PUT /api/chat/rename
// @access  Protected
const renameGroup = async (req, res) => {

    const { chatId, chatName } = req.body;

    const updatedChat = await ChatModel.findByIdAndUpdate(
        chatId,
        {
        chatName: chatName,
        },
        {
        new: true,
        })
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

    if (!updatedChat) {
        res.status(404).send({ message: "Chat Not Found" });
    } else {
        res.send(updatedChat);
    }
};

// @desc    Remove user from Group
// @route   PUT /api/chat/groupRemove
// @access  Protected
const removeFromGroup = async (req, res) => {
  const { chatId, userId } = req.body;

  // check if the requester is admin

  const removed = await ChatModel.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!removed) {
    res.status(404).send({ message: "Chat Not Found" });
  } else {
    res.json(removed);
  }
};

// @desc    Add user to Group / Leave
// @route   PUT /api/chat/groupAdd
// @access  Protected
const addToGroup = async (req, res) => {

  const { chatId, userId } = req.body;

  // check if the requester is admin

  const added = await ChatModel.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!added) {
    res.status(404).send({ message: "Chat Not Found" });      
  } else {
    res.json(added);
  }
};

export { accessChat, fetchChats, createGroupChat, renameGroup, removeFromGroup, addToGroup };