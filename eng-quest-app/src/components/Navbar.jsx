import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Select,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import AddBook from "./AddBook";
import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";

const Navbar = () => {
  const { user, logout, toggleRole } = useContext(AuthContext);
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box
      p={"10px"}
      bg={"blue.100"}
      boxShadow={"rgba(0, 0, 0, 0.2) 0px 4px 12px"}
      transition="background-color 0.3s, box-shadow 0.3s"
      _hover={{
        bg: "blue.200", // Change background color on hover
        boxShadow: "rgba(0, 0, 0, 0.4) 0px 8px 16px", // Add box shadow on hover
      }}
    >
      <Flex
        justifyContent={"space-between"}
        alignItems={"center"}
        padding={"0 15px"}
        maxW={"1280px"}
        m={"auto"}
      >
        <Flex gap={"15px"} justifyContent={"center"} alignItems={"center"}>
          <Image
            src="https://cdn.iconscout.com/icon/free/png-256/free-books-2923907-2446112.png?f=webp"
            width={"50px"}
          />
          <Link to={"/"}>
            <Heading>Book Store</Heading>
          </Link>
          <AddBook isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
        </Flex>

        {user.isAuth ? (
          <Flex gap={"15px"} justifyContent={"center"} alignItems={"center"}>
            {/* ... (existing code) */}
            <Button
              onClick={() => logout()}
              colorScheme="blackAlpha"
              _hover={{
                backgroundColor: "blackAlpha.800", // Change background color on hover
              }}
            >
              Logout
            </Button>
          </Flex>
        ) : (
          <Flex gap={"15px"}>
            <Link to={"/login"}>
              <Button
                colorScheme="blackAlpha"
                _hover={{
                  backgroundColor: "blackAlpha.800", // Change background color on hover
                }}
              >
                Login
              </Button>
            </Link>
            <Link to={"/signup"}>
              <Button
                colorScheme="blackAlpha"
                _hover={{
                  backgroundColor: "blackAlpha.800", // Change background color on hover
                }}
              >
                Sign up
              </Button>
            </Link>
          </Flex>
        )}
      </Flex>
    </Box>
  );
};

export default Navbar;
