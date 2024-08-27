import { Message } from "../components/SingleChat";

const isSameUser = (messages: Message[], msg: Message, index: number) => {
    return index > 0 && messages[index - 1].sender._id === msg.sender._id;
}

export default isSameUser;