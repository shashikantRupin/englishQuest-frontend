import Cookies from 'js-cookie';
import { serverUrl } from '../../configs';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Box,
    Button,
    useDisclosure,
    Text,
    CloseButton,
} from '@chakra-ui/react'
import React, { useContext, useEffect, useState } from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Flex,
    Input,
    Select,
} from '@chakra-ui/react'
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
} from '@chakra-ui/react'
import { Alert, AlertIcon, AlertTitle, AlertDescription } from '@chakra-ui/react';


const Homepage = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: delIsOpen, onOpen: delOnOpen, onClose: delOnClose } = useDisclosure();
    const [data, setData] = useState([]);
    const [editData, setEditData] = useState({});
    const { user, refresh, setRefresh, selectedRole } = useContext(AuthContext);
    const [formData, setFormData] = useState(editData);
    const [filter, setFilter] = useState("");
    const [sort, setSort] = useState("");
    const [time, setTime] = useState("");
    const [page, setPage] = useState(1)
    const [totalPage, setTotalPage] = useState("")
    const [deleteId, setDeleteId] = useState("")
    const [limit, setLimit] = useState(10)
    const cancelRef = React.useRef()
    const [error, setError] = useState(null);

    const getData = async (url) => {
        try {
            const res = await axios.get(url, {
                headers: {
                    "Authorization": `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                }
            });
            // console.log(res.data)
            setError(null)
            setTotalPage(res.data.totalPages)
            setData(res.data.data);
        } catch (error) {
            setError(error.response?.data.message)
            // console.log(error);
        }
    };

    const patchData = async (url, obj) => {
        try {
            const res = await axios.patch(url, obj, {
                headers: {
                    "Authorization": `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (res) {
                setRefresh(!refresh);
                onClose();
            }
            setError(null)
        } catch (error) {
            setError(error.response?.data.message)
            // console.log(error);
        }
    };

    const deleteData = async (url, obj) => {
        try {
            const res = await axios.delete(url, {
                headers: {
                    "Authorization": `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (res) {
                setRefresh(!refresh);
                onClose();
            }
            setError(null)
        } catch (error) {
            setError(error.response?.data.message)
            // console.log(error);
        }
    };

    const handleDelete = (id) => {
        setDeleteId(id)

    }

    const handleForm = (e) => {
        e.preventDefault();
        console.log(formData)
        const { _id, author, genre, title } = formData
        patchData(serverUrl + "/books/update/" + _id, { author, genre, title })
    };

    const handleFormInput = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    useEffect(() => {
        setFormData(editData);
    }, [editData]);

    useEffect(() => {
        let query = {};
        query.page = page;
        query.limit = limit;
        query.role = user.selectedRole

        if (filter) {
            query.genre = filter;
        }
        if (sort) {
            query.sort = "createdAt";
            query.order = sort;
        }
        if (time) {
            query[time] = 1;
        }

        let Query = new URLSearchParams(query).toString();

        let newUrl = serverUrl + "/books" + (Query ? "?" + Query : "");
        getData(newUrl);
    }, [refresh, filter, sort, time, page, limit, user.selectedRole]);



    return (
        <Box m={"10px"}>
            {error && (
                <Alert status="error" variant="solid" mb={4}>
                    <AlertIcon />
                    <AlertTitle mr={2}>Error!</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                    <CloseButton onClick={() => setError(null)} position="absolute" right="8px" top="8px" />
                </Alert>
            )}

            <Flex gap={"20px"} maxW={"1280px"} margin={"auto"} mt={"15px"}
                mb={"15px"}>
                <Select value={filter} onChange={(e) => { setFilter(e.target.value); setPage(1) }}>
                    <option value="">Filter by genre</option>
                    <option value="Classic">Classic</option>
                    <option value="Fiction">Fiction</option>
                    <option value="Dystopian">Dystopian</option>
                    <option value="Novel">Novel</option>
                </Select>
                <Select value={sort} onChange={(e) => { setSort(e.target.value); setPage(1) }}>
                    <option value="">Sort by Time</option>
                    <option value="desc">Ascending</option>
                    <option value="asc">Descending</option>
                </Select>
                <Select value={time} onChange={(e) => { setTime(e.target.value); setPage(1) }}>
                    <option value="">Books time</option>
                    <option value="new">Less than 10 mins ago</option>
                    <option value="old">Greater than 10 mins ago</option>
                </Select>
            </Flex>
            <TableContainer mt={"20px"}>
                <Table variant='striped' colorScheme="gray">
                    <Thead>
                        <Tr>
                            <Th>Sr No.</Th>
                            <Th>Title</Th>
                            <Th>Author</Th>
                            <Th>Genre</Th>
                            <Th>Created At</Th>
                            {
                                user.role && user.selectedRole === "CREATER" ? <><Th>Edit</Th>
                                    <Th>Delete</Th></> : <></>
                            }

                        </Tr>
                    </Thead>
                    <Tbody>
                        {data && data.map((ele, index) => {
                            let date = Date.now() - Date.parse(ele.createdAt);
                            let minutes = Math.floor((date / (1000 * 60)) % 60);
                            let hours = Math.floor((date / (1000 * 60 * 60)) % 24);
                            let days = Math.floor(date / (1000 * 60 * 60 * 24));

                            let time = "";

                            if (days > 0) {
                                time += days + (days === 1 ? " day " : " days ");
                            }

                            if (hours > 0) {
                                time += hours + " hrs ";
                            }

                            if (minutes > 0 || (days === 0 && hours === 0)) {
                                time += minutes + " mins ";
                            }

                            time += "ago";

                            return (
                                <Tr key={ele._id}>
                                    <Td>{(page - 1) * 10 + index + 1}</Td>
                                    <Td>{ele.title}</Td>
                                    <Td>{ele.author}</Td>
                                    <Td>{ele.genre}</Td>
                                    <Td>{time}</Td>
                                    {
                                        user.role && user.selectedRole === "CREATER" ? <>
                                            <Td>
                                                <Button onClick={() => { setEditData(ele); onOpen(); }} colorScheme='green'>Edit</Button>
                                            </Td>
                                            <Td>
                                                <Button backgroundColor={"red.300"} onClick={() => { handleDelete(ele._id); delOnOpen() }} colorScheme='red'>Delete</Button>
                                            </Td>
                                        </> : <></>
                                    }
                                </Tr>
                            );
                        })}
                    </Tbody>

                </Table>
            </TableContainer>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent padding={"10px 0"}>
                    <ModalHeader textAlign={"center"} fontSize={"1.5rem"}>Edit Book Details</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <form onSubmit={handleForm}>
                            <Flex flexDir={"column"} gap={"15px"} padding={"10px 15px"} maxW={"450px"} m={"auto"}>
                                <Input placeholder='Title' name='title' size="lg" type='text' required value={formData.title} onChange={handleFormInput} />
                                <Input placeholder='Author' name='author' size="lg" type='text' required value={formData.author} onChange={handleFormInput} />
                                <Select name='genre' size="lg" required value={formData.genre} onChange={handleFormInput}>
                                    <option value="">Select Genre</option>
                                    <option value="Classic">Classic</option>
                                    <option value="Fiction">Fiction</option>
                                    <option value="Dystopian">Dystopian</option>
                                </Select>

                                <Button type='submit'>Edit Book</Button>
                                <Button colorScheme='blue' onClick={onClose}>
                                    Go back
                                </Button>
                            </Flex>
                        </form>
                    </ModalBody>
                </ModalContent>
            </Modal>

            <Flex justifyContent={"center"} alignItems={"center"} gap={"20px"} mt={"15px"}>
                <Button onClick={() => setPage(page - 1)} isDisabled={page === 1} colorScheme='teal'>
                    Previous
                </Button>
                <Text>{page}</Text>
                <Button onClick={() => setPage(page + 1)} isDisabled={page === totalPage} colorScheme='teal'>
                    Next
                </Button>
            </Flex>
            <>
                <AlertDialog
                    isOpen={delIsOpen}
                    leastDestructiveRef={cancelRef}
                    onClose={delOnClose}
                >
                    <AlertDialogOverlay>
                        <AlertDialogContent>
                            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                                Delete Book
                            </AlertDialogHeader>

                            <AlertDialogBody>
                                Are you sure? You can't undo this action afterwards.
                            </AlertDialogBody>

                            <AlertDialogFooter>
                                <Button ref={cancelRef} onClick={delOnClose}>
                                    Cancel
                                </Button>
                                <Button colorScheme='red' onClick={() => { deleteData(serverUrl + "/books/delete/" + deleteId); delOnClose() }} ml={3}>
                                    Delete
                                </Button>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialogOverlay>
                </AlertDialog>
            </>

        </Box>
    );
};

export default Homepage;
