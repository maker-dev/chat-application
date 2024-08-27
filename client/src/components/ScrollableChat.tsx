import ScrollableFeed from "react-scrollable-feed"
import { Message } from "./SingleChat"
import { Avatar, Box, Tooltip } from "@chakra-ui/react"
import useChat from "../hooks/useChat"
import isSameSender from "../utils/isSameSender"
import isLastMessage from "../utils/isLastMessage"
import isSameSenderMargin from "../utils/isSameSenderMargin"
import isSameUser from "../utils/isSameUser"

interface ScrollableChatProps {
    messages: Message[]
}

function ScrollableChat({messages}: ScrollableChatProps) {

  const {user} = useChat();

  return (
    <ScrollableFeed>
      {
        messages.map((msg, index) => {
          return (
            <Box 
            key={msg._id} 
            display={"flex"}
            >
              {
                (
                  isSameSender(messages, msg, index, user._id)
                  ||
                  isLastMessage(messages, index, user._id)
                ) &&
                (
                  <Tooltip 
                    label={msg.sender.name}
                    placement="bottom-start"
                    hasArrow>
                      <Avatar
                        mt={7}
                        mr={1}
                        size={"sm"}
                        cursor={"pointer"}
                        name={msg.sender.name}
                        src={msg.sender.pic}
                      />
                  </Tooltip>
                )
              }
              <span
                style={{
                  backgroundColor: `${
                    msg.sender._id === user._id ? "#8EE3F8" : "#89F5D0"
                  }`,
                  borderRadius: "20px",
                  padding: "5px 15px",
                  maxWidth: "75%",
                  marginLeft: isSameSenderMargin(messages, msg, index, user._id),
                  marginTop: isSameUser(messages, msg, index) ? 3 : 10
                }}
              >
                {
                  msg.content
                }
              </span>
            </Box>
          )
        })
      }
    </ScrollableFeed>
  )
}

export default ScrollableChat