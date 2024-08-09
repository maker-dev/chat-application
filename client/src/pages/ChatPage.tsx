import { Box } from "@chakra-ui/react";
import useUser from "../hooks/useChat"
import SideDrawer from "../components/miscellaneous/SideDrawer";
import MyChats from "../components/MyChats";
import ChatBox from "../components/ChatBox";
import { useState } from "react";

function ChatPage() {

  const { user } = useUser();
  const [fetchAgain, setFetchAgain] = useState<boolean>(false);

  return (
    <Box>
      {user && <SideDrawer />}
      <Box
        display="flex"
        justifyContent="space-between" 
        width="100%"
        h="calc(100vh - 53.5px)"
        p={2}
      >
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>  }
      </Box>
    </Box>
  )
}

export default ChatPage