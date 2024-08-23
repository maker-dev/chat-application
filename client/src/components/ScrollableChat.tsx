import ScrollableFeed from "react-scrollable-feed"
import { Message } from "./SingleChat"

interface ScrollableChatProps {
    messages: Message[]
}

function ScrollableChat({messages}: ScrollableChatProps) {
    console.log(messages);
  return (
    <ScrollableFeed>

    </ScrollableFeed>
  )
}

export default ScrollableChat