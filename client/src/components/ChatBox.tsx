import { Box } from "@chakra-ui/react";
import useChat from "../hooks/useChat"

function ChatBox() {

  const {selectedChat} = useChat();
  
  return (
    <Box
      display={{base: selectedChat._id ? "flex" : "none", md: "flex"}}
    >
      Single Chat
    </Box>
  )
}

export default ChatBox