import { ViewIcon } from "@chakra-ui/icons";
import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, useDisclosure, IconButton, useToast, Box, FormControl, Input, Spinner } from "@chakra-ui/react";
import { Dispatch, SetStateAction, useState } from "react";
import useChat from "../../hooks/useChat";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";
import { AxiosError } from "axios";
import { groupAdd, groupRemove, renameGroup } from "../../api/services/ChatService";
import { searchUser } from "../../api/services/UserService";
import UserListItem from "../UserAvatar/UserListItem";
import {Chat} from '../../context/ChatProvider';
import {User} from '../../interfaces/User';

interface UpdateGroupChatProps {
  fetchAgain: boolean;
  setFetchAgain: Dispatch<SetStateAction<boolean>>;
  fetchMessages: () => void;
}


function UpdateGroupChat({fetchAgain, setFetchAgain, fetchMessages}: UpdateGroupChatProps) {

    const {onClose, onOpen, isOpen} = useDisclosure();

    const {selectedChat, setSelectedChat, user} = useChat();

    const [groupChatName, setGroupChatName] = useState<string>("");
    const [search, setSearch] = useState<string>("");
    const [searchResult, setSearchResult] = useState<User[]>([]);
    const [searchLoading, setSearchLoading] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const toast = useToast();

    const handleAddUser = async (userId: string) => {
        if (selectedChat.users.find(u => u._id === userId)) {
            toast({
                title: "User Already in group !",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })
            return;
        }

        if (selectedChat.groupAdmin._id !== user._id) {
            toast({
                title: "Only admins can add someone !",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })
            return;
        }

        try {
            setLoading(true);
            const {data} = await groupAdd(selectedChat._id, userId, user.token);
            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
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

    const handleRemoveUser = async (userId: string) => {
        if (selectedChat.groupAdmin._id !== user._id && userId !== user._id) {
            toast({
                title: "Only admins can remove someone",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })
            return;
        }

        try {
            setLoading(true);
            const {data} = await groupRemove(selectedChat._id, userId, user.token);
            userId === user._id ? setSelectedChat({} as Chat) : setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            fetchMessages();
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

    const handleRenameChat = async () => {
        if (!groupChatName) return;

        try {
            setLoading(true);
            const {data} = await renameGroup(selectedChat._id, groupChatName, user.token);
            setSelectedChat(data);
            setFetchAgain(!fetchAgain)
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

    return (
        <>
        <IconButton
            display={{ base: "flex" }}
            icon={<ViewIcon />}
            onClick={onOpen} aria-label={""}        
        />

        <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent>
            <ModalHeader
                fontSize={"35px"}
                fontFamily={"Work sans"}
                textAlign={"center"}
            >
                {selectedChat.chatName}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <Box
                    display={"flex"}
                    flexWrap={"wrap"}
                >
                  {
                    selectedChat.users.map(u => {
                        return <UserBadgeItem 
                                    key={u._id}
                                    user={u as User}
                                    handleFunction={() => handleRemoveUser(u._id)}    
                                />
                    })
                  }
                </Box>
                <FormControl
                    display={"flex"}
                >
                    <Input
                        placeholder="chat Name"
                        mb={3}
                        value={groupChatName}
                        onChange={e => setGroupChatName(e.target.value)}
                    />
                    <Button
                        variant={"solid"}
                        colorScheme="teal"
                        ml={1}
                        isLoading={loading}
                        onClick={handleRenameChat}
                    >
                        Update
                    </Button>
                </FormControl>
                <FormControl>
                    <Input
                        placeholder="Add user to group"
                        mb={1}
                        onChange={e => handleSearch(e.target.value)}
                    />
                </FormControl>
                {
                    searchLoading ? (
                        <Spinner size={"lg"}/>
                    ) : (
                        searchResult?.map(u => {
                            return <UserListItem 
                                key={u._id}
                                user={u}
                                handleFunction={() => handleAddUser(u._id)}
                            />
                        })
                    )
                }
            </ModalBody>
            <ModalFooter>
                <Button colorScheme='red' onClick={() => handleRemoveUser(user._id)}>
                    Leave Group
                </Button>
            </ModalFooter>
            </ModalContent>
        </Modal>
        </>
  )
}

export default UpdateGroupChat