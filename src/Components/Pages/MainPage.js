import React, {useMemo,useEffect, useState } from "react";
import MenuButton from "../Navigation/MenuButton";
import {useDispatch, useSelector} from 'react-redux';
import { change_page } from "../Window/windowSlice";
import { update_form } from "../Uploading/modalSlice";
import {RepeatIcon, AddIcon, InfoIcon, CheckCircleIcon , PlusSquareIcon} from "@chakra-ui/icons";
import CAT from '../../../src/assets/nyan-cat-poptart-cat.gif'
import DocumentCard from "../Applications/DocumentCard";


import {ToyotaIcon} from '../brand_icons/ToyotaIcon'
import { GameIcon } from "../General Icons/GameIcon";
import { CalendarIcon } from "../General Icons/CalendarIcon";
import { set_update_page } from "./pageSlice";
import { Button, Icon,Spinner } from "@chakra-ui/react";
import { Image } from "@chakra-ui/react";


import UploadModal from "../Uploading/UploadModal"
import ViewModal from "../Viewing/ViewModal";
import {useDisclosure} from "@chakra-ui/react"

import {getDocs, doc, query, where, collection} from "firebase/firestore"
import { db } from "../../helpers/firebase_init";


// Connect to the server
//const socket = io.connect('/');

//*Note for Icons, remember to delete some of the links  in the header


//Dynamic component that renders the current page from a list of pages(pageConfigs)
//Takes those elements, and renders them
export default function MainPage()
{

    const update_page = useSelector((state) => state.update_page.value);
    const page = useSelector((state) => state.window.value);
    const loading = useSelector((state) => state.loading.value);
    const dispatch = useDispatch();
    const [cards, setCards] = useState([]);


    const { isOpen: isUploadOpen, onOpen: onUploadOpen, onClose:onUploadClose } = useDisclosure();
    const {isOpen: isViewOpen, onOpen: onViewOpen, onClose: onViewClose} = useDisclosure();

            //Object that stores pages as other objects
    //Button configs is an array of objects that represent the buttons(MenuButton)
    //(Text, action, icon, and color scheme)
    //documentCards is a flag to check if we should populate with cards
    const pageConfigs = useMemo(() => { return{
        
            home_page: { buttonConfigs: [ {text: "Vacation", action: ()=> dispatch(change_page("vacation_page")), icon: CalendarIcon, colorScheme: "teal", variant:"outline"},
                                          {text: "Games", action: ()=> dispatch(change_page("games_page")), icon: GameIcon, colorScheme: "teal", variant:"outline"}] },
    
            vacation_page: { buttonConfigs: [ {text: "Canada", action: ()=> dispatch(change_page("canada_vacations")), icon: CalendarIcon, colorScheme: "red"} ] },

            canada_vacations: {documentCards:true},

            games_page: {documentCards:true}
        
        }
    
    
    },[dispatch]);

    //Every time the page is changed make a request to the server to get
    //the cards for this page
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

                querySnapshot.forEach(doc => {
                    fetchedCards.push({id:doc.id, ...doc.data()})
                });

                setCards(fetchedCards);

            } catch (error)
            {
                console.error('error fetching cards', error)
            }
        };

        //Render cards if it is a page that has them or an update has been raised
        if(pageConfigs[page].documentCards || update_page) 
        {
            fetchCards();
            dispatch(set_update_page(false));
        }

        /*
        //I forgot why I put this here....
        dispatch(set_updated_page(false));



        // Listen for the 'card updated' event
        socket.on('card updated', () => {
            console.log("Card updated event received. Refreshing cards.");
            populatePages();
        });

        // Remove the event listener when the component is unmounted
        return () => {
            socket.off('card updated');
        };
        */

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
            <DocumentCard key={index} onOpen={onViewOpen} {...config}></DocumentCard>
            ): null}

            {pageConfigs[page].documentCards? <Button position={"fixed"} bg={"#74d1a6"} color={"white"} right={"20px"} bottom={"20px"} onClick={()=>{onUploadOpen()}}><Icon as={AddIcon} boxSize={5}/></Button>: null}

            <UploadModal handleOpen={isUploadOpen} handleClose={onUploadClose}/>
            <ViewModal isOpen={isViewOpen} onClose={onViewClose} />


            <Image src={CAT} style={{position:"fixed", left:"0px", bottom:"5px", width:"75px", height:"75px"}} alt={"el gato"}></Image>

        </>
    )
}