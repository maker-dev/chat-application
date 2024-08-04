import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, Text, useToast, VStack } from "@chakra-ui/react"
import { useRef, useState } from "react"
import { registerUser } from "../../api/services/UserService";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import * as yup from 'yup';
import registerSchema from "../../validation/registerSchema";

function Register() {
  
  const navigate = useNavigate();
  const toast = useToast();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [pic, setPic] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const inputFileRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>): void => {

    setLoading(true);

    if (!event.target.files) return;

    const currFile: File = event.target.files[0];

    if (currFile === null) {
      setLoading(false);
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }

     if (currFile.type === "image/jpeg" || currFile.type === "image/png") {
        const data = new FormData();
        data.append("file", currFile);
        data.append("upload_preset", "chatApplication");
        data.append("cloud_name", "damtetpyk");
        fetch("https://api.cloudinary.com/v1_1/damtetpyk/image/upload", {
          method: "post",
          body: data,
        })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
     }
  };

  const handleChooseFile = () => {
    if (inputFileRef.current) {
      inputFileRef.current.click();
    }
  }

  const handleShowPassword = () => setShowPassword(!showPassword);


  const submitHandler = async () => {
    
    setLoading(true);

    try {
      await registerSchema.validate({ name, email, password, confirmPassword, pic });
      const { data } = await registerUser({ name, email, password, pic });
      toast({
        title: "Registration Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      window.localStorage.setItem("userInfo", JSON.stringify(data));
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
      } else if ( error instanceof yup.ValidationError) {
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
        <FormLabel>Name</FormLabel>
        <Input type='text'
          placeholder="Enter Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>
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
      <FormControl isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input type={showPassword ? 'text' : 'password'}
            value={confirmPassword}
            placeholder="Confirm Your password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <InputRightElement width={"4.5rem"}>
          <Button color={"black"} size={"sm"} h={"1.75rem"} onClick={handleShowPassword}>
              {showPassword ? "show" : "hide"}
          </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl isRequired>
        <FormLabel htmlFor="file-upload">Upload Your Image</FormLabel>
        <Input
          type="file"
          id="file-upload"
          onChange={handleFileChange}
          display={"none"}
          ref={inputFileRef}
        />
        <Button
          variant={"outline"}
          colorScheme="blue"
          onClick={handleChooseFile}
        >
          Choose File
        </Button>
        {
          pic && 
          <Text color={"green.500"} fontSize={"lg"} mt={2}>
            Image uploaded successfully!
          </Text>
        }
      </FormControl>
      <Button
        colorScheme="blue"
        width={"100%"}
        mt={15}
        isLoading={loading}
        onClick={submitHandler}
      >
        Register
      </Button>
    </VStack>
  )
}

export default Register