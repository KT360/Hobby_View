import React from "react";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Textarea,
  } from '@chakra-ui/react'
import { Button } from "@chakra-ui/react";
import { FcPlus } from "react-icons/fc";
import { Flex,Avatar,Box,Heading,Text,Image,VStack} from "@chakra-ui/react";
import { db } from "../../helpers/firebase_init";
import { getDoc, doc,collection, query, orderBy, onSnapshot, serverTimestamp, addDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { format } from 'date-fns';



export default function ViewModal({isOpen, onClose}){

    const cardID = useSelector((state) => state.selected.value);
    const currentUser = useSelector((state) => state.CurrentUser.value);
    const [comments, setComments] = useState(null);
    const [card, setCard] = useState({Description:"", imagePath:"",owner:"",page:""});
    const [cardOwner, setCardOwner] = useState({name:"", uid:""});
    const [currentComment, setCurrentComment] = useState("");

    useEffect(() =>{


        if(isOpen)
        {
            let unsubscribe =  () => {};

            const getCardData = async () => {

                const cardRef = doc(db, 'Cards', cardID);
                const cardSnap = await getDoc(cardRef);
    
                setCard(cardSnap.data());

                const ownerRef = doc(db,'users',card.owner);
                const ownerSnap = await getDoc(ownerRef);

                setCardOwner(ownerSnap.data());
            };
    

            const getCommentData = async () => {

                const commentsRef = collection(db, `Cards/${cardID}/Comments`);
                const q = query(commentsRef, orderBy("createdAt"));
        
                unsubscribe =  onSnapshot(q,  async (querySnapshot)=> {
                    
                    const commentPromises = querySnapshot.docs.map( async (doc) => {
                        const commentData = {id: doc.id, ...doc.data()};
                        const userDetails = await fetchUserDetails(commentData.owner);
                        return {...commentData, ownerName: userDetails ? userDetails.name : "Uknown", displayDate: commentData ? format(commentData.createdAt.toDate(), 'MMMM dd, yyyy HH:mm') : "Uknown date"};

                    });
                    
                    const newComments = await Promise.all(commentPromises);
        
                    setComments(newComments);
                });
            }
    
            getCardData();
            getCommentData();
    
            return () => unsubscribe();

        }


    }, [isOpen]);

    const fetchUserDetails = async (userId) => {
        const userRef = doc(db,'users', userId);
        const userSnap = await getDoc(userRef);

        if(userSnap.exists()){
            return userSnap.data();
        }else
        {
            console.log("No such user");
            return null;
        }
    }

    const addComment = ()=> {
        
        const commentsRef = collection(db, `Cards/${cardID}/Comments`);

        const commentData = {
        owner: currentUser.uid,
        text:currentComment,
        createdAt:serverTimestamp()
        };

        addDoc(commentsRef, commentData)
        .then(() => {console.log("Comment added")})
        .catch((error) => console.error("Error adding comment: ",error));
    }


    return(
        <>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent maxW={"800px"}>
                    <ModalHeader>
                        <Flex flex='1' gap='4' alignItems='center' flexWrap='wrap'>
                            <Avatar name={cardOwner.name} />
                            <Box>
                            <Heading size='sm'>{cardOwner.name}</Heading>
                            </Box>
                        </Flex>
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Flex gap='10' alignItems='center' flexDirection={"column"}>
                            <Text>
                                {card.Description}
                            </Text>
                            <Image src={card.imagePath} alt='topic' />


                            <Textarea placeholder="Write your thoughts!" onChange={event => setCurrentComment(event.currentTarget.value)}></Textarea>
                            <Button leftIcon={<FcPlus/>} borderRadius={15} backgroundColor={"lightgreen"} onClick={addComment}>
                                Add a Comment
                            </Button>

                            { comments ?
                                <Box
                                maxH="300px" // Adjust based on your needs
                                overflowY="scroll"
                                borderWidth="1px"
                                borderRadius="lg"
                                p={4}
                                width="600px"
                                >
                                    <VStack spacing={4} align="stretch">
                                        {comments.map((comment, index) => (

                                        <Box key={index} p={5} shadow="md" borderWidth="1px">
                                            <Flex flex='1' gap='4' alignItems='center' flexWrap='wrap'>
                                                <Avatar name={comment.ownerName} />
                                                <Box>
                                                <Heading size='sm'>{comment.ownerName}</Heading>
                                                </Box>
                                            </Flex>
                                            <Text mt={2}>{comment.text}</Text>
                                            <Text mt={1} fontWeight={"light"}>{comment.displayDate}</Text>
                                        </Box>
                                        ))}
                                    </VStack>
                                </Box>

                                :


                                <Box maxH='50px' maxW={"150x"} backgroundColor={"lightgray"} >
                                    <Text>
                                        No comments.
                                    </Text>
                                </Box>
                            }

                        </Flex>

                    </ModalBody>

                    <ModalFooter>

                    </ModalFooter>
                </ModalContent>
            </Modal>
        
        </>
    )
}