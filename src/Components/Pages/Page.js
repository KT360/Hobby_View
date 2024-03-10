import React from "react";
import MenuButton from "../Navigation/MenuButton";
import {useDispatch, useSelector} from 'react-redux';
import { change_page } from "../Window/windowSlice";
import { CalendarIcon, RepeatIcon, AddIcon, InfoIcon, CheckCircleIcon } from "@chakra-ui/icons";
import DocumentCard from "../Applications/DocumentCard";
import { useEffect, useState } from "react";
import axios from "axios";
import {ToyotaIcon} from '../brand_icons/ToyotaIcon'
import { FordIcon } from "../brand_icons/FordIcon";
import { LexusIcon } from "../brand_icons/LexusIcon";
import { set_update_page } from "./pageSlice";
import { Button, Icon, position,Spinner } from "@chakra-ui/react";
import { io } from "socket.io-client";

import UploadModal from "../Uploading/UploadModal"
import {useDisclosure} from "@chakra-ui/react"
import firebaseConfig from "../../helpers/apiKeys";

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {collection, addDoc, readDoc, getFirestore, getDoc, doc} from "firebase/firestore"



const app = initializeApp(firebaseConfig);

const db = getFirestore(app);



// Connect to the server
//const socket = io.connect('/');

//*Note for Icons, remember to delete some of the links  in the header


//Dynamic component that renders the current page from a list of pages(pageConfigs)
//Takes those elements, and renders them
export default function Page()
{

    const update_page = useSelector((state) => state.update_page.value);
    const page = useSelector((state) => state.window.value);
    const modal = useSelector((state) => state.modal.value);
    const loading = useSelector((state) => state.loading.value);
    const dispatch = useDispatch();
    const [cards, setCards] = useState([]);


    const { isOpen, onOpen, onClose } = useDisclosure()

    //Every time the page is changed make a request to the server to get
    //the cards for this page
    useEffect(() => {
        const populatePages = async ()=>
        {

            try{
                const docRef = doc(db, "BlogData", "pages")
                const docSnap = await getDoc(docRef)

                if(docSnap.exists())
                {
                    console.log("New cards data: "+JSON.stringify(docSnap.data()[page],null,2));
                    setCards(docSnap.data()[page])
                }else
                {
                    console.log("No such document!")
                }
            } catch (error)
            {
                console.error('error fetching cards', error)
            }
        };

        //Render cards if it is a page that has them or an update has been raised
        if(pageConfigs[page].documentCards || update_page)
        {
            populatePages();
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

    }, [page, update_page]);


        
    //Object that stores pages as other objects
    //Button configs is an array of objects that represent the buttons(MenuButton)
    //(Text, action, icon, and color scheme)
    //documentCards is a flag to check if we should populate with cards
    const pageConfigs = {
        
        home_page: { buttonConfigs: [ {text: "KBS", action: ()=> dispatch(change_page("kbs_page")), icon: CalendarIcon, colorScheme: "green"},
                                      {text: "Toyota", action: ()=> dispatch(change_page("toyota_main")), icon: ToyotaIcon, colorScheme: "red"},
                                      {text: "Lexus", action: ()=> dispatch(change_page("lexus_main")), icon: LexusIcon, colorScheme: "orange"},
                                      {text: "Ford", action: ()=> dispatch(change_page("ford_main")), icon: FordIcon, colorScheme: "blue"}] },


        toyota_main: {buttonConfigs: [{text: "Line 2", action: ()=> dispatch(change_page("line_page")), colorScheme: "red"},
                                      {text: "Line 4", action: ()=> dispatch(change_page("line_page")), colorScheme: "red"} ]},

        lexus_main: {buttonConfigs: [{text: "Line 3", action: ()=> dispatch(change_page("line_page")), colorScheme: "orange"}, ]},
        
        ford_main: {buttonConfigs: [{text: "Line 6", action: ()=> dispatch(change_page("line_page")), colorScheme: "blue"}, ]},

        line_page: {buttonConfigs: [{text: "Control Plan", action: ()=> dispatch(change_page("home_page")), colorScheme: "cyan"},
                                    {text: "Error Proofing", action: ()=> dispatch(change_page("home_page")), colorScheme: "cyan"},
                                    {text: "Layout", action: ()=> dispatch(change_page("home_page")), colorScheme: "cyan"},
                                    {text: "PFMEA", action: ()=> dispatch(change_page("home_page")), colorScheme: "cyan"}]},


        kbs_page: { buttonConfigs: [ {text: "TPM", action: ()=> dispatch(change_page("tpm_page")), icon: InfoIcon, colorScheme: "green"},
                                     {text: "Quality", action: () => dispatch(change_page("quality_page")), icon: CheckCircleIcon, colorScheme: "purple"},
                                     {text: "Std Work", action: () => dispatch(change_page("quality_page")), icon: CheckCircleIcon, colorScheme: "pink"},
                                     {text: "Plant Requirements", action: () => dispatch(change_page("quality_page")), icon: PlusSquareIcon, colorScheme: "green"} ],},

        quality_page: {documentCards: true,},
        
        tpm_page: { buttonConfigs: [ {text: "2S", action: ()=> dispatch(change_page("two_s_page")), icon: CalendarIcon, colorScheme: "blue"}, {text: "Back", action: ()=> dispatch(change_page("kbs_page")), icon: RepeatIcon, colorScheme: "green" }, ] },
        
        two_s_page: { documentCards: true, }
    
    }

    
    //render the specific elements for that page if it has them
    return(
        <>

            {loading ? <div style={{backgroundColor:"rgba(214, 217, 232, 0.35)", zIndex:10,height:"100%", width:"100%" ,position:"absolute", display:"flex", alignItems:"center", justifyContent:"center"}}>
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
            <DocumentCard key={index} onOpen={onOpen} {...config}></DocumentCard>
            ): null}

            {pageConfigs[page].documentCards? <Button position={"absolute"} right={"20px"} bottom={"20px"}><Icon as={AddIcon} boxSize={5}/></Button>: null}

            <UploadModal index={modal.index} handleOpen={isOpen} handleClose={onClose}/>
        </>
    )
}