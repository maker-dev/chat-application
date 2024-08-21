import MessageModel from '../models/Message.js';
import UserModel from '../models/User.js';
import ChatModel from '../models/Chat.js';


//@description     Send New Message
//@route           POST /api/message
//@access          Protected
const sendMessage = async (req, res) => {
    const {content, chatId} = req.body;

    if (!content || !chatId) {
        return res.status(400).send({message: "Invalid data passed into request"});
    }

    var newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId
    }

    try {
        var message = await MessageModel.create(newMessage);
        message = await message.populate("sender", "name pic");
        message = await message.populate("chat");

        message = await UserModel.populate(message, {
            path: "chat.users",
            select: "name pic email"
        })

        await ChatModel.findByIdAndUpdate(chatId, {
            latestMessage: message
        });

        res.send(message);

    } catch (error) {
        res.status(400).send({ message: error.message });
    }
}

//@description     get chat messages
//@route           GET /api/message/:chatId
//@access          Protected
const allMessages = async (req, res) => {

    const {chatId} = req.params;

    try {
        const messages = await MessageModel.find({chat: chatId})
        .populate("sender", "name pic email")
        .populate("chat");

        res.send(messages);

    } catch (error) {
        res.status(400).send({ message: error.message });
    }

}

export {sendMessage, allMessages};