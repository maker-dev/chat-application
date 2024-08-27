import { Message } from "../components/SingleChat";

const isSameSenderMargin = (messages: Message[], msg: Message, index: number, userId: string): number | string => {
    if (
        index < messages.length - 1 &&
        messages[index + 1].sender._id === msg.sender._id &&
        messages[index].sender._id !== userId
    )
    return 33;

    else if (
        (
            index < messages.length - 1 &&
            messages[index + 1].sender._id !== msg.sender._id &&
            messages[index].sender._id !== userId
        ) ||
        (
            index === messages.length - 1 && messages[index].sender._id !== userId
        )
    )
    return 0

    else return "auto";
}

export default isSameSenderMargin;