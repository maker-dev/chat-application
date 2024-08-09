import { Dispatch, SetStateAction } from "react";
import useChat from "../hooks/useChat";
import { Box, IconButton, Text } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import getSender from "../utils/getSender";
import ProfileModal from "./miscellaneous/ProfileModal";
import getProfileSender from "../utils/getProfileSender";
import UpdateGroupChat from "./miscellaneous/UpdateGroupChat";
import {Chat} from '../context/ChatProvider';

interface SingleChatProps {
  fetchAgain: boolean;
  setFetchAgain: Dispatch<SetStateAction<boolean>>;
}

function SingleChat({fetchAgain, setFetchAgain}: SingleChatProps) {
    
    const {user, selectedChat, setSelectedChat} = useChat();

    
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
                                <UpdateGroupChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
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