//TODO:
//Add card component with image
//Add expandable/transitioning image
//Add context menu to card -> Pop up -> Upload image
import React, { useEffect } from "react"
import { Card, CardHeader, CardBody ,Flex, Avatar, Box, Heading, Text, IconButton, CardFooter} from "@chakra-ui/react"
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { db } from "../../helpers/firebase_init";
import { doc, getDoc, getDocs, collection, query } from "firebase/firestore";
import { set_selected } from "./cardSlice";
import Heart from "./Heart";
import { FaCommentAlt } from "react-icons/fa";



//Card to display data fetched from the server
export default function DocumentCard({name,Description, imagePath, index , onOpen, id,...props})
{

    const [owner, setOwner] = useState(null);
    const [commentNumb, setCommentNumb] = useState(0);
    const [likeNumb, setLikeNumb] = useState(0);



    const dispatch = useDispatch();

    const user = useSelector((state) => state.CurrentUser.value);

    useEffect(() => {

        const getUser = async ()=> {
            
            const userRef = doc(db, 'users', user.uid);
            const userSnap = await getDoc(userRef);

            setOwner(userSnap.data().name);

            const q1 = query(collection(db, `Cards/${id}/Likes`));
            const snap1 = await getDocs(q1);

            setLikeNumb(snap1.size);

            const q2 = query(collection(db, `Cards/${id}/Comments`));
            const snap2 = await getDocs(q2);

            setCommentNumb(snap2.size);
        };

        getUser();
    },[user.uid])

    return(
        <Card _hover={{border:"3px solid #65cc9c", borderRadius:"5px"}} onClick={() => {onOpen(); dispatch(set_selected(id))}} maxW='md' {...props} margin={5} backgroundColor={'white'}>
            <CardHeader>
                <Flex flex='1' gap='4' alignItems='center' flexWrap='wrap'>
                    <Avatar name={owner} />

                    <Box>
                    <Heading size='sm'>{owner}</Heading>
                    </Box>
                </Flex>

            </CardHeader>
            <CardBody>
                <Text>
                    {Description}
                </Text>
            </CardBody>
            <img src={imagePath} alt="hobby pic"/>
            <CardFooter>
                <Flex gap={1}>
                    <Heart cardID={id}/>
                    <Text>{likeNumb}</Text>
                </Flex>
                <Flex gap={1} ml={3}>
                    <button style={{background:"transparent", border:"none", cursor:"pointer"}}>
                        <FaCommentAlt />
                    </button>
                    <Text>{commentNumb}</Text>
                </Flex>
            </CardFooter>
        </Card>
    )
}