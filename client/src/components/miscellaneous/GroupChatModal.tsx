import { Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast } from "@chakra-ui/react";
import { useState } from "react";
import useChat from "../../hooks/useChat";
import { searchUser } from "../../api/services/UserService";
import { AxiosError } from "axios";
import UserListItem from "../UserAvatar/UserListItem";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";
import { createGroup } from "../../api/services/ChatService";
import {User} from '../../interfaces/User';

interface GroupChatModalProps {
    children: React.ReactNode;
}


function GroupChatModal({children}: GroupChatModalProps) {

    const { isOpen, onOpen, onClose } = useDisclosure();

    const [groupChatName, setGroupChatName] = useState<string>("");
    const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
    const [search, setSearch] = useState<string>("");
    const [searchResult, setSearchResult] = useState<User[]>();
    const [searchLoading, setSearchLoading] = useState<boolean>(false);
    const [creationLoading, setCreationLoading] = useState<boolean>(false);

    const toast = useToast();

    const { user, chats, setChats } = useChat();

    const handleSearch = async (query: string) => {
        setSearch(query);
        if (!query) {
            return;
        }

        try {
            setSearchLoading(true);
            const {data} = await searchUser(search, user.token);
            setSearchResult(data);
            setSearchLoading(false);
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
            setSearchLoading(false);
        }
    }

    const handleSubmit = async () => {
        if (!groupChatName || !selectedUsers) {
            toast({
                title: "Please fill all the fields",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top"
            })
            return;
        }

        try {
            setCreationLoading(true);
            const users = JSON.stringify(selectedUsers.map(u => u._id));
            const {data} = await createGroup(groupChatName, users, user.token);
            setChats([data, ...chats]);
            setCreationLoading(false);
            onClose();
            toast({
                title: "New Group Chat Created !",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })
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
            setCreationLoading(false);
        }
    }

    const handleGroup = (user: User) => {
        if (selectedUsers.includes(user)) {
            toast({
                title: "User already added",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top"
            });
            return;
        }

        setSelectedUsers(prev => [...prev, user]);
    }

    const removeUser = (user: User) => {
        setSelectedUsers(users => (
            users.filter(u => u._id !== user._id)
        ))
    }

    return (
    <>
        <span onClick={onOpen}>{children}</span>
            
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader
                    fontSize={"35px"}
                    fontFamily={"Work sans"}
                    display={"flex"}
                    justifyContent={"center"}
                >
                    Create Group Chat
                </ModalHeader>
            <ModalCloseButton />
                <ModalBody
                    display ={"flex"}
                    flexDir={"column"}
                    alignItems="center"
                >
                    <FormControl>
                        <Input 
                            placeholder="Chat Name" 
                            mb={3} 
                            onChange={e => setGroupChatName(e.target.value)}
                        />
                    </FormControl>
                    <FormControl>
                        <Input
                            placeholder="Add Users"
                            mb={1}
                            onChange={(e => handleSearch(e.target.value))}
                        />
                    </FormControl>
                    <Box
                        width={"60%"}
                        marginLeft={"auto"}
                        marginRight={"auto"}
                        display={"flex"}
                        flexDir={"row"}
                        flexWrap={"wrap"}
                    >
                        {
                            selectedUsers.map(user => {
                                return <UserBadgeItem key={user._id} user={user} handleFunction={() => removeUser(user)}/>
                            })
                        }
                    </Box>
                    {
                        searchLoading ? 
                        <div>loading...</div>
                        :
                        searchResult?.slice(0, 4).map(user => {
                            return <UserListItem key={user._id} user={user} handleFunction={() => handleGroup(user)}/>
                        })
                    }
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme='blue' onClick={handleSubmit} isLoading={creationLoading}>
                        Create Chat
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    </>
  )
}

export default GroupChatModal