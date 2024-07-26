import { Box, Container, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from "@chakra-ui/react"
import Login from "../components/Auth/Login"
import Register from "../components/Auth/Register"

function HomePage() {

  return (
    <Container maxW={"xl"} centerContent>
      <Box
        w={"100%"}
        p={3}
        display={"flex"}
        justifyContent={"center"}
        bg={"white"}
        m={"20px 0 15px"}
        borderRadius={"lg"}
        borderWidth={"1px"}
      >
        <Text fontSize={"3xl"} fontWeight={"300"}>Welcome To My Chat</Text>
      </Box>
      <Box
        bg={"white"}
        w={"100%"}
        p={4}
        borderRadius={"lg"}
        borderWidth={"1px"}
      >
        <Tabs variant='soft-rounded' colorScheme='blue'>
          <TabList mb={"1em"}>
            <Tab w={"50%"}>Login</Tab>
            <Tab w={"50%"}>Register</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Register />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  )
}

export default HomePage