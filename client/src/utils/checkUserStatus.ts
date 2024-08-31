import { ChatUser } from "../context/ChatProvider";

const checkUserStatus = (onlineUsers: string[], userId: string, chatUsers: ChatUser[]) => {
    const getOtherUser = chatUsers.find(otherUser => otherUser._id !== userId);
    if (!getOtherUser?._id) return;
    return onlineUsers.includes(getOtherUser._id) ? "online" : "offline";
} 

export default checkUserStatus;