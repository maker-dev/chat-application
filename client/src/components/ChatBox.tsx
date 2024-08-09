import { Box } from "@chakra-ui/react";
import useChat from "../hooks/useChat"
import { Dispatch, SetStateAction } from "react";
import SingleChat from "./SingleChat";

interface ChatBoxProps {
  fetchAgain: boolean;
  setFetchAgain: Dispatch<SetStateAction<boolean>>;
}


function ChatBox({fetchAgain, setFetchAgain}: ChatBoxProps) {

  const {selectedChat} = useChat();
  
  return (
    <Box
      display={{base: selectedChat._id ? "flex" : "none", md: "flex"}}
      alignItems={"center"}
      flexDir={"column"}
      p={3}
      bg={"white"}
      w={{base: "100%", md: "68%"}}
      borderRadius={"lg"}
      borderWidth={"1px"}
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
    </Box>
  )
}

export default ChatBox