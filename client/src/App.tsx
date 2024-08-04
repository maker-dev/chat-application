import { Route, Routes } from "react-router-dom"
import HomePage from "./pages/HomePage"
import ChatPage from "./pages/ChatPage"
import { Box } from "@chakra-ui/react"
import ChatProvider from "./context/ChatProvider"

function App() {

  return (
    <ChatProvider>
      <Box
        bg={"lightskyblue"}
        minHeight={"100vh"}
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/chats" element={<ChatPage />} />
        </Routes>
      </Box>
    </ChatProvider>
  )
}

export default App
