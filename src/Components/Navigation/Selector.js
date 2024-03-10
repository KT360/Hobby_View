import React from 'react'
import {useDispatch} from 'react-redux';
import Navbutton from './Navbutton';
import { Icon } from '@chakra-ui/react'
import {EditIcon, CalendarIcon} from '@chakra-ui/icons'


//Top right buttons to navigate to main pages quicker
export default function Selector()
{
    //<Navbutton Icon={<CalendarIcon></CalendarIcon>} text={'Page 2'} page_number={1}></Navbutton>
    const dispatch = useDispatch();

    return(
        <div style={{color: "Green"}}>
            <Navbutton Icon={<EditIcon></EditIcon>} text={'Home Page'} page_name={"home_page"}></Navbutton>
           
        </div>
    );
}