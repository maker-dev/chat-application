import { Route, Routes } from "react-router-dom"
import HomePage from "./pages/HomePage"
import ChatPage from "./pages/ChatPage"
import { Box } from "@chakra-ui/react"

function App() {

  return (
      <Box
        bg={"lightskyblue"}
        minHeight={"100vh"}
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/chats" element={<ChatPage />} />
        </Routes>
      </Box>
  )
}

export default App
