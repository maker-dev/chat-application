import { BellIcon, ChevronDownIcon, SearchIcon } from "@chakra-ui/icons";
import { Avatar, Box, Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Input, Menu, MenuButton, MenuItem, MenuList, Spinner, Text, Tooltip, useDisclosure, useToast } from "@chakra-ui/react";
import { useState } from "react"
import ProfileModal from "./ProfileModal";
import { useNavigate } from "react-router-dom";
import { searchUser } from "../../api/services/UserService";
import { AxiosError } from "axios";
import ChatLoading from "../ChatLoading";
import UserListItem from "../UserAvatar/UserListItem";
import { accessChat } from "../../api/services/ChatService";
import useChat from "../../hooks/useChat";
import {UserAuth, Chat} from '../../context/ChatProvider';
import {User} from '../../interfaces/User';
import getSender from "../../utils/getSender";

function SideDrawer() {
  
  const navigate = useNavigate();
  const { user, setUser, setSelectedChat, chats, setChats, notifications, setNotifications } = useChat();
  const [search, setSearch] = useState<string>("");
  const [searchResult, setSearchResult] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingChat, setLoadingChat] = useState<boolean>(false);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const logoutHandler = () => {
    window.localStorage.removeItem("userInfo");
    setSelectedChat({} as Chat);
    setChats([]);
    setUser({} as UserAuth);
    setNotifications([]);
    navigate("/");
  }

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      })
      return;
    }

    try {
      setLoading(true);
      const {data} = await searchUser(search, user.token);
      setSearchResult(data);
      setLoading(false);
    } catch (error) {
      if (error instanceof AxiosError) {
          toast({
            title: error.response?.data.message,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
      } else {
          toast({
            title: "Something went wrong",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
      }
      setLoading(false);
    }
  }

  const accessChatHandler = async (userId: string) => {
    try {
      setLoadingChat(true);
      const { data } = await accessChat(userId, user.token);
      if (!chats.find(c => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      setSearch("");
      setSearchResult([]);
      onClose();
    } catch (error) {
      if (error instanceof AxiosError) {
        toast({
          title: error.response?.data.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      } else {
        toast({
          title: "Something went wrong",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
      setLoadingChat(false);
    }
  }


  return (
    <>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        bg={"white"}
        w={"100%"}
        p={"5px 10px"}
        borderWidth={"2px"}
      >
        <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <SearchIcon mr={2}/>
            <Text display={{base: "none", md: "flex"}} px={4}>
              Search User
            </Text>
          </Button>
        </Tooltip>

        <Text fontSize={"2xl"} fontFamily={"Work sans"} fontWeight={"500"}>
          Talk Now
        </Text>

        <Box>
          <Menu>
            <MenuButton p={1} position={"relative"} mr={2}>
              <BellIcon fontSize={"2xl"} m={1}/>
                {notifications.length > 0 && (
                <Box
                  position="absolute"
                  top="0"
                  right="0"
                  bg="red.500"
                  color="white"
                  borderRadius="full"
                  fontSize="0.6em"
                  width="16px"
                  height="16px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  fontWeight={"bold"}
                >
                  {notifications.length}
                </Box>
              )}
            </MenuButton>
            <MenuList pl={2}>
              {!notifications.length && "No New Messages"}
              {
                notifications.map(notif => {
                  return <MenuItem key={notif._id} onClick={() => {
                    setSelectedChat(notif.chat)
                    setNotifications(notifications.filter(n => n !== notif))
                  }}>
                    {
                    notif.chat.isGroupChat 
                    ? `New Message in ${notif.chat.chatName}` 
                    : `New Message from ${getSender(user, notif.chat.users)}`
                    } 
                  </MenuItem>
                })
              }
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton
              as={Button}
              rightIcon={<ChevronDownIcon />}
            >
              <Avatar size={"sm"}
                cursor={"pointer"}
                name={user?.name}
                src={user?.pic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={{
                name: user.name,
                email: user.email,
                pic: user.pic
              }}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </Box>
      </Box> 
      <Drawer size={"xs"} placement="left" isOpen={isOpen} onClose={onClose}>
        <DrawerOverlay/>
        <DrawerContent>
          <DrawerHeader borderBottomWidth={"1px"}>Search Users</DrawerHeader>
          <DrawerBody>
            <Box
              display={"flex"}
              pb={2}
            >
              <Input 
                placeholder="Enter name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult.map(user => <UserListItem key={user._id} user={user} handleFunction={() => accessChatHandler(user._id)}/>)   
            )}
            {
              <Box display={"flex"} justifyContent={"center"} mt={5}>
                {
                  loadingChat && <Spinner size={"md"}/>
                }
              </Box>
            }
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default SideDrawer