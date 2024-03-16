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
import { getDoc, doc,collection, query, orderBy, onSnapshot, serverTimestamp, addDoc, where, getDocs } from "firebase/firestore";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { format } from 'date-fns';
import { set_update_page } from "../Pages/pageSlice";
import EmojiPicker from "emoji-picker-react";
import { FaSmile } from "react-icons/fa";
import Heart from "../Applications/Heart";


//Some of this stuff was simplified for the sake of practice, but alot of the querying might be SUPER inefficient ex: re-rendering everything on like

export default function ViewModal({isOpen, onClose}){

    const cardID = useSelector((state) => state.selected.value);
    const currentUser = useSelector((state) => state.CurrentUser.value);
    const update = useSelector((state) => state.update_page.value);

    const dispatch = useDispatch();

    const [comments, setComments] = useState(null);
    const [card, setCard] = useState({Description:"", imagePath:"",owner:"",page:""});
    const [cardOwner, setCardOwner] = useState({name:"", uid:""});
    const [currentComment, setCurrentComment] = useState("");
    const [currentlyLiked, setCurrentlyLiked] = useState(false);
    const [reactionOpen, setReactionOpen] = useState(false);

    useEffect(() =>{

        setReactionOpen(false);

        if(isOpen)
        {
            let unsubscribe =  () => {};

            const getCardData = async () => {

                const cardRef = doc(db, 'Cards', cardID);
                const cardSnap = await getDoc(cardRef);
    
                if(cardSnap.exists())
                {
                    setCard(cardSnap.data());

                    if(card.owner)
                    {
                        const ownerRef = doc(db,'users',card.owner);
                        const ownerSnap = await getDoc(ownerRef);

                        if(ownerSnap.exists())
                        {
                            setCardOwner(ownerSnap.data());
                        }
                    }
                }

            };
    

            const getCommentData = async () => {

                const commentsRef = collection(db, `Cards/${cardID}/Comments`);
                const q = query(commentsRef, orderBy("createdAt","desc"));
        
                unsubscribe =  onSnapshot(q,  async (querySnapshot)=> {
                    
                    const commentPromises = querySnapshot.docs.map( async (doc) => {
                        const commentData = {id: doc.id, ...doc.data()};
                        const userDetails = await fetchUserDetails(commentData.owner);
                        return {...commentData, ownerName: userDetails ? userDetails.name : "Uknown", displayDate: commentData.createdAt ? format(commentData.createdAt.toDate(), 'MMMM dd, yyyy HH:mm') : "Uknown date"};

                    });
                    
                    const newComments = await Promise.all(commentPromises);
        
                    setComments(newComments);
                });
            }

            const checkIfLiked = async () => {
                const q = query(collection(db, `Cards/${cardID}/Likes`), where("uid","==",currentUser.uid));
                const querySnapshot = await getDocs(q);
                setCurrentlyLiked(!querySnapshot.empty);
            };
    
    
            checkIfLiked();
            getCardData();
            getCommentData();

            console.log("rendered!")
    
            return () => unsubscribe();

        }


    }, [isOpen, card.owner, cardID, currentUser.uid, update]);

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

        const check = currentComment.replace(/\s+/g, '');
        if(check !== "")
        {
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
                            <div style={{alignItems:"start", width:"100%"}}>
                                <Heart cardID={cardID} isLiked={currentlyLiked} updateCallBack={()=>{dispatch(set_update_page(!update))}}/>
                            </div>

                            <div>
                                <Textarea width={"600px"} placeholder="Write your thoughts!" onChange={event => setCurrentComment(event.currentTarget.value)} value={currentComment}></Textarea>
              
                                <FaSmile style={{position:"relative", bottom:"30px", left:"2px", cursor:"pointer", zIndex:"5"}} onClick={() => {setReactionOpen(!reactionOpen)}} size={25} />
    
                                <EmojiPicker open={reactionOpen} style={{position:"relative", top:"0px"}} onEmojiClick={(emoji,e) => {setCurrentComment(currentComment+emoji.emoji)}} />
                            </div>

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