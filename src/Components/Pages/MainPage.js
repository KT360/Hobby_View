import React, {useMemo,useEffect, useState } from "react";
import MenuButton from "../Navigation/MenuButton";
import {useDispatch, useSelector} from 'react-redux';
import { change_page } from "../Window/windowSlice";

import { AddIcon} from "@chakra-ui/icons";
import CAT from '../../../src/assets/nyan-cat-poptart-cat.gif'
import DocumentCard from "../Applications/DocumentCard";



import { GameIcon } from "../General Icons/GameIcon";
import { CalendarIcon } from "../General Icons/CalendarIcon";
import { set_update_page } from "./pageSlice";
import { Button, Icon,Spinner } from "@chakra-ui/react";
import { Image } from "@chakra-ui/react";


import UploadModal from "../Uploading/UploadModal"
import ViewModal from "../Viewing/ViewModal";
import {useDisclosure} from "@chakra-ui/react"

import {getDocs, query, where, collection} from "firebase/firestore"
import { db } from "../../helpers/firebase_init";



//*Note for Icons, remember to delete some of the links  in the header


//Dynamic component that renders the current page from a list of pages(pageConfigs)
export default function MainPage()
{

    const update_page = useSelector((state) => state.update_page.value);
    const page = useSelector((state) => state.window.value);
    const loading = useSelector((state) => state.loading.value);
    const dispatch = useDispatch();
    const [cards, setCards] = useState([]);


    //Objects that keep track of my modal states, One for the modal responsible for uploading, the other for the modal responsible for viewing posts/comments etc.
    const { isOpen: isUploadOpen, onOpen: onUploadOpen, onClose:onUploadClose } = useDisclosure();
    const {isOpen: isViewOpen, onOpen: onViewOpen, onClose: onViewClose} = useDisclosure();

    //Object that stores pages as other objects
    //Button configs is an array of objects that represent the buttons(MenuButton)
    //Each MenuButton requires to be passed in a page and a function to notify for the page change
    //documentCards is a flag to check if we should populate with cards i.e user posts
    //UseMemo so that react creates the object once, and remembers it
    const pageConfigs = useMemo(() => { return{
        
            home_page: { buttonConfigs: [ {text: "Vacation", action: ()=> dispatch(change_page("vacation_page")), icon: CalendarIcon, colorScheme: "teal", variant:"outline"},
                                          {text: "Games", action: ()=> dispatch(change_page("games_page")), icon: GameIcon, colorScheme: "teal", variant:"outline"}] },
    
            vacation_page: { buttonConfigs: [ {text: "Canada", action: ()=> dispatch(change_page("canada_vacations")), icon: CalendarIcon, colorScheme: "red"} ]},

            canada_vacations: {documentCards:true},

            games_page: {documentCards:true}
        
        }
    
    
    },[dispatch]);

    //Every time the page is changed make a request to the server to get the cards for the current page
    useEffect(() => {
        const fetchCards = async ()=>
        {

            try{
                //Reference collection
                const cardsRef = collection(db, "Cards");
                //Create query
                const q = query(cardsRef, where('page', '==', page));

                //Execute query
                const querySnapshot = await getDocs(q);
                const fetchedCards = [];

                //Get card data, add in the Firestore doc ID just in case
                querySnapshot.forEach(doc => {
                    fetchedCards.push({id:doc.id, ...doc.data()})
                });

                setCards(fetchedCards);

                //console.log("Cards fetched: "+JSON.stringify(fetchedCards));

            } catch (error)
            {
                console.error('error fetching cards', error)
            }
        };

        //Fetch and Render cards if it is a page that has them
        if(pageConfigs[page].documentCards) 
        {
            fetchCards();
            dispatch(set_update_page(false));
        }

    }, [page, update_page, pageConfigs, dispatch]);


    
    //render the specific elements for that page if it has them
    return(
        <>

            {loading ? <div style={{backgroundColor:"rgba(214, 217, 232, 0.35)", zIndex:2000,height:"100%", width:"100%" ,position:"absolute", display:"flex", alignItems:"center", justifyContent:"center"}}>
                <Spinner
                thickness='4px'
                speed='0.65s'
                emptyColor='gray.200'
                color='blue.500'
                size='xl'
                
                />
            </div>
            : null}

            {pageConfigs[page].buttonConfigs?.map((config, index) => 
            <MenuButton key={index} {...config}></MenuButton> //Pass configs to component (ex: text, action)
            )}
            
            {pageConfigs[page].documentCards? cards?.map((config, index) => 
            <DocumentCard key={config.id} onOpen={onViewOpen} {...config}></DocumentCard>//It's important that the key here is FireStore document ID, React seems to confuse post data between page if not set
            ): null}

            {pageConfigs[page].documentCards? <Button position={"fixed"} bg={"#74d1a6"} color={"white"} right={"20px"} bottom={"20px"} onClick={()=>{onUploadOpen()}}><Icon as={AddIcon} boxSize={5}/></Button>: null}

            <UploadModal handleOpen={isUploadOpen} handleClose={onUploadClose}/>
            <ViewModal isOpen={isViewOpen} onClose={onViewClose} />


            <Image src={CAT} style={{position:"fixed", left:"0px", bottom:"5px", width:"75px", height:"75px"}} alt={"el gato"}></Image>

        </>
    )
}