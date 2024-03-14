import React from 'react'
import Navbutton from './Navbutton';
import {EditIcon} from '@chakra-ui/icons';


//Top right buttons to navigate to main pages quicker
export default function Selector()
{
    //<Navbutton Icon={<CalendarIcon></CalendarIcon>} text={'Page 2'} page_number={1}></Navbutton>

    return(
        <div>
            <Navbutton Icon={<EditIcon></EditIcon>} text={'Home Page'} page_name={"home_page"}></Navbutton>
           
        </div>
    );
}