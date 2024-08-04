import { ViewIcon } from "@chakra-ui/icons";
import { useDisclosure, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, IconButton, Image, Text } from "@chakra-ui/react";

interface User {
    name: string;
    email: string;
    pic: string;
}

interface ProfileModalProp {
    user: User,
    children?: React.ReactNode;
}

function ProfileModal({ user, children }: ProfileModalProp) {
    
    const { isOpen, onOpen, onClose } = useDisclosure()
  

    return (
        <>
            {children ? (
                <span onClick={onOpen}>{children}</span>
            ) : (
                    <IconButton
                        display={{ base: "flex" }}
                        icon={<ViewIcon />}
                        onClick={onOpen} aria-label={""}/>       
            )}

            <Modal size={"lg"} isCentered isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent h={"410px"}>
                    <ModalHeader
                        fontSize={"40px"}
                        fontFamily={"Work sans"}
                        display={"flex"}
                        justifyContent={"center"}
                    >
                        {user.name}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        display={"flex"}
                        flexDir={"column"}
                        alignItems={"center"}
                        justifyContent={"space-between"}
                    > 
                        <Image
                            borderRadius={"full"}
                            boxSize={"150px"}
                            src={user.pic}
                            alt={user.name}
                        />
                        <Text
                            fontSize={{ base: "28px", md: "30px" }}
                            fontFamily={"Work sans"}
                        >
                            Email: {user.email}
                        </Text>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
  )
}

export default ProfileModal;