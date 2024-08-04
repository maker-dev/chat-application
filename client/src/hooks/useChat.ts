import { useContext } from "react"
import { ChatContext } from "../context/ChatProvider"
import { ChatContextType } from '../context/ChatProvider';

const useChat = (): ChatContextType => {
    const context = useContext(ChatContext)
    if (context) return context;
    else throw new Error("something went wrong");
}

export default useChat;