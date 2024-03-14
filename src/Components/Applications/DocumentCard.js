//TODO:
//Add card component with image
//Add expandable/transitioning image
//Add context menu to card -> Pop up -> Upload image
import React, { useEffect } from "react"
import { Card, CardHeader, CardBody ,Flex, Avatar, Box, Heading, Text, IconButton} from "@chakra-ui/react"
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { db } from "../../helpers/firebase_init";
import { doc, getDoc } from "firebase/firestore";
import { set_selected } from "./cardSlice";



//Card to display data fetched from the server
export default function DocumentCard({name,Description, imagePath, index , onOpen, id,...props})
{

    const [owner, setOwner] = useState(null);
    const dispatch = useDispatch();

    const user = useSelector((state) => state.CurrentUser.value);

    useEffect(() => {

        const getUser = async ()=> {
            
            const userRef = doc(db, 'users', user.uid);
            const userSnap = await getDoc(userRef);

            setOwner(userSnap.data().name);
        };

        getUser();
    },[user.uid])

    return(
        <Card _hover={{bg:"#B1CDD2"}} onClick={() => {onOpen(); dispatch(set_selected(id))}} maxW='md' {...props} margin={5} backgroundColor={'#d0e7f7'}>
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
        </Card>
    )
}