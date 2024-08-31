import { createContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { Message } from "../components/SingleChat";

interface ChatProviderProps {
    children: React.ReactNode;
}

export interface UserAuth {
    _id: string;
    name: string;
    email: string;
    pic: string;
    token: string;
}

export interface ChatUser {
    _id: string;
    name: string;
    email: string;
    pic: string;
    createdAt: string;
    updatedAt: string;
    isAdmin?: boolean;
}

export interface Chat {
    _id: string;
    chatName: string;
    isGroupChat: boolean;
    users: ChatUser[];
    groupAdmin: ChatUser;
    createdAt: string;
    updatedAt: string;
}

export interface ChatContextType {
    user: UserAuth;
    setUser: (user: UserAuth) => void;
    selectedChat: Chat;
    setSelectedChat: (selectedChat: Chat) => void;
    chats: Chat[];
    setChats: (chats: Chat[]) => void;
    notifications: Message[];
    setNotifications: (notifications: Message[]) => void;
    onlineUsers: string[];
    setOnlineUsers: (onlineUsers: string[]) => void;
}

const ChatContext = createContext<ChatContextType>({} as ChatContextType);

function ChatProvider({ children }: ChatProviderProps) {
    
    const [user, setUser] = useState<UserAuth>({} as UserAuth);
    const [selectedChat, setSelectedChat] = useState<Chat>({} as Chat);
    const [chats, setChats] = useState<Chat[]>([]);
    const [notifications, setNotifications] = useState<Message[]>([]);
    const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
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
        <ChatContext.Provider value={{user, setUser, selectedChat, setSelectedChat, chats, setChats, notifications, setNotifications, onlineUsers, setOnlineUsers}}>
            {
                children
            }
        </ChatContext.Provider>
    )
}


export default ChatProvider

export { ChatContext };