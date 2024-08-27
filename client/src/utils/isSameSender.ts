import { Message } from "../components/SingleChat";

const isSameSender = (messages: Message[], msg: Message, index: number, userId: string) => {
    return (
        index < messages.length - 1 && 
        (
            messages[index + 1].sender._id !== msg.sender._id ||
            messages[index + 1].sender._id === undefined
        ) && messages[index].sender._id !== userId
    )
}

export default isSameSender;