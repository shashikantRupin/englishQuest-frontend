import { Box, Button, Checkbox, Flex, Grid, Heading, Input, Radio, RadioGroup, Stack, Text } from '@chakra-ui/react'
import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { serverUrl } from '../../configs'
import { useToast } from '@chakra-ui/react'

const Signup = () => {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [checkedItems, setCheckedItems] = useState([false, false, false])
    const allChecked = checkedItems.every(Boolean)
    const isIndeterminate = checkedItems.some(Boolean) && !allChecked
    const navigate = useNavigate();
    const toast = useToast()
    const signup = async (url, obj) => {
        try {
            const res = await axios.post(url + "/api/signup", obj)
            toast({
                position: 'top',
                title: res.data.message,
                status: "success",
                duration: 5000,
                isClosable: true,
            })
            navigate("/login")
        } catch (error) {
            toast({
                position: 'top',
                title: error.response?.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
            })
            // console.log(error)
        }
    }
    const handleSignup = (e) => {
        e.preventDefault()
        let arr = []
        if (checkedItems[0]) {
            arr.push("CREATER")
        }
        if (checkedItems[1]) {
            arr.push("VIEW")
        }
        if (checkedItems[2]) {
            arr.push("VIEW_ALL")
        }
        signup(serverUrl, { email, password, name, role: arr })
    }

    return (
      <Box>
        <Flex justifyContent={"center"} alignItems={"center"} h={"90vh"}>
          <Grid
            gridTemplateColumns={"1fr 1fr"}
            maxW={"1200px"}
            margin={"auto"}
            boxShadow={"rgba(0, 0, 0, 0.24) 0px 0px 10px"}
            borderRadius={"10px"}
          >
            <Box>
              <img
                src="https://i0.wp.com/consiliumeducation.com/itm/wp-content/uploads/sites/4/2021/01/girls-5711423_1920.jpg?resize=477%2C317&ssl=1"
                alt="err"
                width={"90%"}
              />
            </Box>
            <Flex
              justifyContent={"center"}
              alignItems={"center"}
              flexDir={"column"}
            >
              <Heading
                fontSize={"2rem"}
                p={3}
                textAlign={"center"}
                color={"blackAlpha.700"}
              >
                Signup Here
              </Heading>

              <Flex flexDir={"column"} gap={"10px"} padding={5} w={"100%"}>
                <form onSubmit={handleSignup}>
                  <Flex
                    flexDir={"column"}
                    gap={"10px"}
                    padding={5}
                    maxW={"450px"}
                    m={"auto"}
                  >
                    <Input
                      placeholder="Name"
                      size="md"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    <Input
                      placeholder="Email"
                      size="md"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />

                    <Flex flexDir={"column"}>
                      <Checkbox
                        isChecked={allChecked}
                        isIndeterminate={isIndeterminate}
                        onChange={(e) =>
                          setCheckedItems([
                            e.target.checked,
                            e.target.checked,
                            e.target.checked,
                          ])
                        }
                        color={"red.800"}
                      >
                        Choose Your Roles
                      </Checkbox>
                      <Flex pl={6} mt={1} gap={"10px"}>
                        <Checkbox
                          isChecked={checkedItems[0]}
                          onChange={() =>
                            setCheckedItems([
                              !checkedItems[0],
                              checkedItems[1],
                              checkedItems[2],
                            ])
                          }
                          color={"gray.500"}
                        >
                          Creater
                        </Checkbox>
                        <Checkbox
                          isChecked={checkedItems[1]}
                          onChange={() =>
                            setCheckedItems([
                              checkedItems[0],
                              !checkedItems[1],
                              checkedItems[2],
                            ])
                          }
                          color={"gray.500"}
                        >
                          Viewer
                        </Checkbox>
                        <Checkbox
                          isChecked={checkedItems[2]}
                          onChange={() =>
                            setCheckedItems([
                              checkedItems[0],
                              checkedItems[1],
                              !checkedItems[2],
                            ])
                          }
                          color={"gray.500"}
                        >
                          View All
                        </Checkbox>
                      </Flex>
                    </Flex>

                    <Input
                      placeholder="Password"
                      size="md"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button type="submit">Sign up</Button>
                    <Text color={"gray.600"} pl={1}>
                      Already a Member?{" "}
                      <b
                        color={"gray.900"}
                        fontWeight={500}
                        display={"inline"}
                        onClick={() => navigate("/login")}
                        _hover={{ color: "red.400", cursor: "pointer" }}
                      >
                        Login Now
                      </b>
                    </Text>
                  </Flex>
                </form>
              </Flex>
            </Flex>
          </Grid>
        </Flex>
      </Box>
    );
}

export default Signup