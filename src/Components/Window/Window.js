import { HStack, IconButton,  Flex, Heading} from '@chakra-ui/react';
import {useDisclosure, Box, Alert} from "@chakra-ui/react"
import {HamburgerIcon, WarningIcon} from '@chakra-ui/icons'

import MainPage from '../Pages/MainPage';
import LoginPage from '../Pages/LoginPage';
import { Drawer, DrawerOverlay, DrawerContent, DrawerHeader, DrawerBody, DrawerFooter } from '@chakra-ui/react';
import Navbutton from '../Navigation/Navbutton';
import {FcTreeStructure} from 'react-icons/fc'
import { Icon } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { MainIcon } from '../General Icons/MainIcon';
import { FaHome } from 'react-icons/fa';

//Main window
//A container for all the main UI components like the drawer
//NavButtons
//and the page
//Holds MainPage, and LoginPage
export default function Window()
{
    const {isOpen, onOpen, onClose} = useDisclosure();

    const version_string = "alpha version: 0.0.3";
    const user = useSelector((state) => state.CurrentUser.value);

    return(
        <>
            <Box bg={"white"}
            px={4}
            position={"sticky"}
            top={0}
            boxShadow={"md"}
            zIndex={2}>
                <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
                    <HStack alignItems={"center"} spacing={4}>
                        
                        {user.name ? 
                            <IconButton
                            size={"sm"}
                            variant={"ghost"}
                            icon={
                                <HamburgerIcon/>
                            }
                            aria-label={"Open Menu"}
                            onClick={isOpen ? onClose : onOpen}
                            ></IconButton>
                        : null}

                        <Drawer placement={'left'} onClose={onClose} isOpen={isOpen}>
                            <DrawerOverlay />
                            <DrawerContent>
                                <DrawerHeader borderBottomWidth='1px'>
                                    <Box display={'flex'} alignContent={'center'}>
                                        <Icon as={FcTreeStructure} boxSize={35} marginRight={5}></Icon>
                                        Quick Menu
                                    </Box>
                                </DrawerHeader>
                                <DrawerBody>
                                    <Navbutton color="white" width="100%" bgColor='#84d6b0' variant='outline' text={"Games"} page_name={"games_page"}/>
                                    <Navbutton color="white" width="100%" bgColor='#84d6b0' variant='outline' text={"Vacation"} page_name={"vacation_page"}/>
                                </DrawerBody>
                                <DrawerFooter fontSize={12} justifyContent={'left'}>{version_string}</DrawerFooter>
                            </DrawerContent>
                        </Drawer>

                        <MainIcon />
                        <Heading  fontWeight={"bold"} size={"md"}>
                            InstaCard
                        </Heading>
                    </HStack>
                    {user.name ? <Navbutton icon={<FaHome />} text={'Home Page'} page_name={"home_page"}></Navbutton> : null}
                </Flex>

            </Box>
            <Alert status='info' alignContent={"center"}>
                <WarningIcon marginRight={5}/>
                {"Beta version: 1.02 (Base Layout), signed in as: "+user.name}
            </Alert>           
            <Box bg={"#edf0ee"} height={"100%"} overflow={"scroll"}>
                {user.name ? <MainPage></MainPage> : <LoginPage></LoginPage>}
            </Box>
        </>
    );
}
