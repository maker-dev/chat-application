import { CloseIcon } from "@chakra-ui/icons";
import { Box } from "@chakra-ui/react"

interface User {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  pic: string;
  createdAt: string;
  updatedAt: string;
}

interface UserBadgeItemProps {
    user: User;
    handleFunction: () => void;
}

function UserBadgeItem({user, handleFunction}: UserBadgeItemProps) {
  return (
    <Box
        px={2}
        py={1}
        borderRadius={"lg"}
        m={1}
        mb={2}
        fontSize={12}
        backgroundColor={"purple"}
        cursor={"pointer"}
        onClick={handleFunction}
        color={"white"}
    >
        {user.name}
        <CloseIcon pl={1}/>
    </Box>
  )
}

export default UserBadgeItem