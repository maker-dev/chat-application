import { createContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";

interface ChatProviderProps {
    children: React.ReactNode;
}

interface User {
    _id: string;
    name: string;
    email: string;
    pic: string;
    token: string;
}

interface ChatUser {
    _id: string;
    name: string;
    email: string;
    pic: string;
    createdAt: string;
    updatedAt: string;
    isAdmin?: boolean;
}

interface Chat {
    _id: string;
    chatName: string;
    isGroupChat: boolean;
    users: ChatUser[];
    createdAt: string;
    updatedAt: string;
}

export interface ChatContextType {
    user: User;
    setUser: (user: User) => void;
    selectedChat: Chat;
    setSelectedChat: (selectedChat: Chat) => void;
    chats: Chat[];
    setChats: (chats: Chat[]) => void;
}

const ChatContext = createContext<ChatContextType>({} as ChatContextType);

function ChatProvider({ children }: ChatProviderProps) {
    
    const [user, setUser] = useState<User>({} as User);
    const [selectedChat, setSelectedChat] = useState<Chat>({} as Chat);
    const [chats, setChats] = useState<Chat[]>([]);
    const navigate = useNavigate();
    
    useEffect(() => {

        const userInfoString: string | null = localStorage.getItem("userInfo");

        if (userInfoString) {
            const userInfo = JSON.parse(userInfoString);
            setUser(userInfo);
            navigate("/chats");
        } else {
            navigate("/");
        }

    
    }, [navigate]);

    return (
        <ChatContext.Provider value={{user, setUser, selectedChat, setSelectedChat, chats, setChats}}>
            {
                children
            }
        </ChatContext.Provider>
    )
}


export default ChatProvider

export { ChatContext };