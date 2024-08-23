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


function SingleChat({fetchAgain, setFetchAgain}: SingleChatProps) {
    
    const {user, selectedChat, setSelectedChat} = useChat();
    const toast = useToast();

    const [loading, setLoading] = useState<boolean>(false);
    const [newMessage, setNewMessage] = useState<string>("");
    const [messages, setMessages] = useState<Message[]>([]);

    const fetchMessages = async () => {
        if (!selectedChat) return;

        try {
            setLoading(true);

            const {data} = await fetchAllMessages(selectedChat._id, user.token);

            setMessages(data);

            console.log(data);

            setLoading(false);
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
        if (selectedChat?._id) fetchMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedChat])


    const typingHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setNewMessage(e.target.value);
    }

    const sendMessage = async (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && newMessage) {
            try {
                const {data} = await sendNewMessage(selectedChat._id, newMessage, user.token);
                setNewMessage("");
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