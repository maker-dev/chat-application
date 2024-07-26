import mongoose from 'mongoose';

const MessageSchema = mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    content: {
        type: String,
        trim: true
    },
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "chats"
    }
}, {timestamps: true})

const MessageModel = mongoose.model("messages", MessageSchema);

export default MessageModel;