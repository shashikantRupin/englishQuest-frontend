import React, { useContext, useEffect, useState } from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    Flex,
    Input,
    Select,
} from '@chakra-ui/react'
import axios from 'axios'
import { AuthContext } from '../context/AuthContext'
import { serverUrl } from '../../configs'
const AddBook = ({ isOpen, onOpen, onClose }) => {

    const [formData, setFormData] = useState({ title: "", author: "", genre: "" })
    const { user, setRefresh, refresh } = useContext(AuthContext)

    const postData = async (url, obj) => {
        try {
            const res = await axios.post(url, obj, {
                headers: {
                    "Authorization": `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                }
            })
            if (res) {
                setRefresh(!refresh)
                onClose()
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleForm = (e) => {
        e.preventDefault()
        postData(serverUrl + "/books", formData)
    }
    const handleFormInput = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value })
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent padding={"10px 0"}>
                <ModalHeader textAlign={"center"} fontSize={"1.5rem"}>Add Book</ModalHeader>
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
                                <option value="Novel">Novel</option>
                            </Select>
                            <Button type='submit' >Add Book</Button>
                            <Button colorScheme='blue' onClick={onClose} >
                                Go back
                            </Button>
                        </Flex>
                    </form>
                </ModalBody>

            </ModalContent>
        </Modal>

    )
}

export default AddBook