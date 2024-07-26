import { VStack, FormControl, FormLabel, Input, InputGroup, InputRightElement, Button, useToast } from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../api/services/UserService";
import { AxiosError } from "axios";
import loginSchema from "../../validation/loginSchema";
import * as yup from 'yup';

function Login() {

  const toast = useToast();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
 

  const handleShowPassword = () => setShowPassword(!showPassword);

  const getGuestCredentials = () => {
    setEmail("guest@gmail.com");
    setPassword("guest12345");
  } 

  const submitHandler = async () => {
    
    setLoading(true);

    try {
      await loginSchema.validate({ email, password });
      const { data } = await loginUser({ email, password });
      toast({
        title: "Login Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      navigate("/chats");
    } catch (error) {
      if (error instanceof AxiosError) {
          toast({
            title: error.response?.data.message,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
      } else if (error instanceof yup.ValidationError) {
          toast({
            title: error.message,
            status: "warning",
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

  return (
    <VStack spacing={4}>
      <FormControl isRequired>
        <FormLabel>Email</FormLabel>
        <Input type='email'
          value={email}
          placeholder="Enter Your Email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input type={showPassword ? 'text' : 'password'}
            value={password}
            placeholder="Enter Your password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width={"4.5rem"}>
            <Button color={"black"} size={"sm"} h={"1.75rem"} onClick={handleShowPassword}>
              {showPassword ? "show" : "hide"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>  
      <Button
        colorScheme="blue"
        width={"100%"}
        mt={15}
        isLoading={loading}
        onClick={submitHandler}
      >
        Login
      </Button>
      <Button
        colorScheme="red"
        width={"100%"}
        onClick={getGuestCredentials}
      >
        Get Guest User Credentials
      </Button>
    </VStack>
  )
}

export default Login