import { ChangeEvent, Dispatch, KeyboardEvent, SetStateAction, useEffect, useState } from "react";
import useChat from "../hooks/useChat";
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import getSender from "../utils/getSender";
import ProfileModal from "./miscellaneous/ProfileModal";
import getProfileSender from "../utils/getProfileSender";
import UpdateGroupChat from "./miscellaneous/UpdateGroupChat";
import {Chat} from '../context/ChatProvider';
import { fetchAllMessages, sendNewMessage } from "../api/services/MessageService";
import { AxiosError } from "axios";
import io, { Socket } from 'socket.io-client';
import ScrollableChat from "./ScrollableChat";

interface SingleChatProps {
  fetchAgain: boolean;
  setFetchAgain: Dispatch<SetStateAction<boolean>>;
}

interface Sender {
    _id: string;
    name: string;
    pic: string;
}

export interface Message {
    _id: string;
    chat: Chat;
    sender: Sender;
    content: string;
    createdAt: string;
    updatedAt: string;
}

const ENDPOINT: string = "http://localhost:5000";

let socket: Socket;
let selectedChatCompare: Chat;

function SingleChat({fetchAgain, setFetchAgain}: SingleChatProps) {
    
    const {user, selectedChat, setSelectedChat} = useChat();
    const toast = useToast();



    const [loading, setLoading] = useState<boolean>(false);
    const [newMessage, setNewMessage] = useState<string>("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [socketConnected, setSocketConnected] = useState<boolean>(false);
    const [typing, setTyping] = useState<boolean>(false);
    const [isTyping, setIsTyping] = useState<boolean>(false);

    const fetchMessages = async () => {
        if (!selectedChat) return;

        try {
            setLoading(true);

            const {data} = await fetchAllMessages(selectedChat._id, user.token);

            setMessages(data);

            setLoading(false);

            socket.emit("join chat", selectedChat._id);
        } catch (error) {
            if (error instanceof AxiosError) {
                toast({
                title: error.response?.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
                });
            } else {
                toast({
                title: "Something went wrong",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
                });
            }
            setLoading(false);
        }
    }

    useEffect(() => {
        socket = io(ENDPOINT);
        
        socket.emit("setup", user);
        
        socket.on("connected", () => {
            setSocketConnected(true);
        });

        socket.on("typing", () => setIsTyping(true))

        socket.on("stop typing", () => setIsTyping(false));

        return () => {
            socket.disconnect();
            setSocketConnected(false);
        }
    }, [user])


    useEffect(() => {
        if (selectedChat?._id) fetchMessages();
        selectedChatCompare = selectedChat;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedChat])


    useEffect(() => {
        socket.on("message received", newMessageReceived => {
            if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
                //give notification
            } else {
                setMessages([...messages, newMessageReceived])
                console.log(newMessageReceived);
            }
        })
    })

    const typingHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setNewMessage(e.target.value);

        if (!socketConnected) return
        
        if (!typing) {
            setTyping(true);
            socket.emit("typing", selectedChat._id);
        }

        const lastTypingTime = new Date().getTime();

        const timerlength: number = 3000;

        setTimeout(() => {
            const timeNow = new Date().getTime();
            const timeDiff = timeNow - lastTypingTime;

            if (timeDiff >= timerlength && typing) {
                socket.emit("stop typing", selectedChat._id); 
                setTyping(false);
            }
        }, timerlength);
    }

    const sendMessage = async (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && newMessage) {
            socket.emit("stop typing", selectedChat._id);
            try {
                const {data} = await sendNewMessage(selectedChat._id, newMessage, user.token);
                setNewMessage("");
                socket.emit("new message", data);
                setMessages([...messages, data]);
            } catch (error) {
                if (error instanceof AxiosError) {
                    toast({
                    title: error.response?.data.message,
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                    });
                } else {
                    toast({
                    title: "Something went wrong",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                    });
                }
            }
        }
    }
    
    return (
        <>{
            selectedChat?._id ? (
                <>
                <Text
                  display={"flex"}
                  justifyContent={{base: "space-between"}}
                  alignItems={"center"}
                  w={"100%"}
                  pb={3}
                  px={2}
                  fontFamily={"Work sans"}
                  fontSize={{base: "28px", md: "30px"}}
                >
                    <IconButton 
                        aria-label={""}
                        display={{base: "flex", md: "none"}}
                        icon={<ArrowBackIcon />}
                        onClick={() => setSelectedChat({} as Chat)}
                    />
                    {
                        !selectedChat.isGroupChat ? (
                            <>
                                {getSender(user, selectedChat.users)}
                                <ProfileModal user={getProfileSender(user, selectedChat.users)}/>
                            </>
                        ) : (
                            <>
                                {selectedChat.chatName.toUpperCase()}
                                <UpdateGroupChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} fetchMessages={fetchMessages}/>
                            </>
                        )
                    }
                </Text>
                <Box
                    display={"flex"}
                    flexDir={"column"}
                    justifyContent={"flex-end"}
                    p={3}
                    bg={"#E8E8E8"}
                    w={"100%"}
                    h={"100%"}
                    borderRadius={"lg"}
                    overflowY={"hidden"}
                >
                {
                    loading ? (
                        <Spinner 
                            size="xl"
                            w={20}
                            h={20}
                            alignSelf={"center"}
                            margin={"auto"}
                        />
                    ): (
                        <Box
                            display={"flex"}
                            flexDirection={"column"}
                            overflowY={"scroll"}
                        >
                            <ScrollableChat 
                                messages={messages}
                                isTyping={isTyping}
                            />
                        </Box>
                    )
                }
                
                    <FormControl 
                        onKeyDown={sendMessage} 
                        isRequired 
                        mt={3}>
                            <Input 
                                variant={"filled"}
                                bg={"#E0E0E0"}
                                placeholder="Enter a message..."
                                onChange={typingHandler}
                                value={newMessage}
                            />
                    </FormControl>
                </Box>
                </>
            ) : (
                <Box
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"center"}
                    h={"100%"}
                >
                    <Text
                        fontSize={"3xl"}
                        pb={3}
                        fontFamily={"Work sans"}
                    >
                        Click on a user to start chatting
                    </Text>
                </Box>
            )
        }</>
    )
}

export default SingleChat