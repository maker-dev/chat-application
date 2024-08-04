import { Box } from "@chakra-ui/react";
import useUser from "../hooks/useChat"
import SideDrawer from "../components/miscellaneous/SideDrawer";
import MyChats from "../components/MyChats";
import ChatBox from "../components/ChatBox";

function ChatPage() {

  const { user } = useUser();

  return (
    <Box>
      {user && <SideDrawer />}
      <Box
        display="flex"
        justifyContent="space-between" 
        width="100%"
        h="calc(100vh - 53.5px)"
        p={1}
      >
        {user && <MyChats />}
        {user && <ChatBox />  }
      </Box>
    </Box>
  )
}

export default ChatPage