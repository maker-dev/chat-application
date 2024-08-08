import { Box, Button, Stack, Text, useToast } from "@chakra-ui/react"
import { fetchChats } from "../api/services/ChatService";
import useChat from "../hooks/useChat";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { AddIcon } from "@chakra-ui/icons";
import ChatLoading from "./ChatLoading";
import getSender from "../utils/getSender";
import GroupChatModal from "./miscellaneous/GroupChatModal";

interface User {
    _id: string;
    name: string;
    email: string;
    pic: string;
    token: string;
}


function MyChats() {

  const [loggedUser, setLoggedUser] = useState<User>({} as User);
  const { user, setChats, selectedChat, chats, setSelectedChat } = useChat();
  const toast = useToast();
  const fetchChatsHandler = async () => {
    try {
      const { data } = await fetchChats(user.token);
      setChats(data);
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

  useEffect(() => {
    const userInfoString: string | null = window.localStorage.getItem("userInfo");
    if (userInfoString) setLoggedUser(JSON.parse(userInfoString));
    if (user.token) fetchChatsHandler();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.token]);

  return (
    <Box
      display={{ base: selectedChat._id ? "none" : "flex", md: "flex" }}
      flexDir={"column"}
      alignItems={"center"}
      p={3}
      bg={"white"}
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth={"1px"}
    >
      <Box
        pb={3}
        px={3}
        fontFamily={"Work sans"}
        display={"flex"}
        w={"100%"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Text
          fontSize={{base: "28px", md: "22px"}}
        >
          My Chats
        </Text>
        <GroupChatModal>
          <Button
            display={"flex"}
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        display={"flex"}
        flexDir={"column"}
        p={3}
        bg={"#F8F8F8"}
        w={"100%"}
        h={"100%"}
        borderRadius={"lg"}
        overflowY={"hidden"}
      >
        {
          chats ? (
            <Stack overflowY={"scroll"}>
              {chats.map(chat => {
                return (
                  <Box
                    onClick={() => setSelectedChat(chat)}
                    cursor={"pointer"}
                    bg={selectedChat === chat ? "#3882AC" : "#E8E8E8"}
                    color={selectedChat === chat ? "white" : "black"}
                    px={3}
                    py={2}
                    borderRadius={"lg"}
                    key={chat._id}
                  >
                    <Text>
                      {
                        !chat.isGroupChat ? (
                          getSender(loggedUser, chat.users)
                        ): (
                          chat.chatName
                        )
                      }
                    </Text>
                  </Box>
                )
              })}
            </Stack>
          ): (
            <ChatLoading />
          )
        }
      </Box>
    </Box>
  )
}

export default MyChats