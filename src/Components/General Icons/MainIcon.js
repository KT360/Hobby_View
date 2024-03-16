import React from "react";
import { Icon } from "@chakra-ui/react";

const IconProps = (props) =>(

<svg width="50px" height="50px" viewBox="0 0 1024 1024" className="icon"  version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M569.2 616.7m-168.1 0a168.1 168.1 0 1 0 336.2 0 168.1 168.1 0 1 0-336.2 0Z" fill="#FFB89A" /><path d="M522.7 765.1c-112.6 0-204.2-91.6-204.2-204.2s91.6-204.2 204.2-204.2c39.3 0 77.5 11.2 110.5 32.4 32 20.6 57.6 49.7 74 84 7.1 15 0.8 32.9-14.2 40-15 7.1-32.9 0.8-40-14.2-11.6-24.3-29.7-44.8-52.3-59.4-23.2-15-50.2-22.9-78-22.9-79.5 0-144.2 64.7-144.2 144.2S443.2 705 522.7 705c19.6 0 38.6-3.8 56.4-11.4 15.2-6.5 32.9 0.6 39.3 15.9 6.5 15.2-0.6 32.9-15.9 39.3-25.2 10.8-52.1 16.3-79.8 16.3z" fill="#33CC99" /><path d="M686.7 659.6c-3.4 0-6.8-0.6-10.1-1.8-15.6-5.6-23.7-22.8-18.1-38.4 3.9-10.8 6.4-22.1 7.6-33.5 1.7-16.5 16.5-28.5 32.9-26.7 16.5 1.7 28.4 16.5 26.7 32.9-1.7 16.2-5.3 32.2-10.8 47.5-4.3 12.3-15.8 20-28.2 20z" fill="#33CC99" /><path d="M801.3 386m-31.3 0a31.3 31.3 0 1 0 62.6 0 31.3 31.3 0 1 0-62.6 0Z" fill="#33CC99" /><path d="M821.1 240.6h-60.8v-0.4c-1.7 0.3-3.5 0.4-5.2 0.4-23.1 0-41.9-24.6-41.9-55 0-3.5 0.3-7 0.7-10.3v-5.9c0-39.6-32.4-72-72-72H386.3c-39.6 0-72 32.4-72 72v8c0.3 2.7 0.5 5.4 0.5 8.2 0 30.4-22.8 55-45.9 55-0.7 0-1.5 0-2.2-0.1v0.1h-12.4v-55.8c0-16.6-13.4-30-30-30s-30 13.4-30 30V241C122 246.5 64.6 307.3 64.6 381v403.2c0 77.2 63.2 140.4 140.4 140.4h616.3c77.2 0 140.4-63.2 140.4-140.4V381c-0.2-77.2-63.4-140.4-140.6-140.4z m80.4 543.5c0 21.3-8.4 41.5-23.7 56.7-15.3 15.3-35.4 23.7-56.7 23.7H204.9c-21.3 0-41.5-8.4-56.7-23.7-15.3-15.3-23.7-35.4-23.7-56.7V381c0-21.3 8.4-41.5 23.7-56.7 15.3-15.3 35.4-23.7 56.7-23.7 0 0 37 0.3 63.9 0s61.8-20 61.8-20c7.2-5.5 13.8-12.1 19.5-19.7 15.8-20.8 24.6-47.5 24.6-75.2 0-3.7-0.2-7.4-0.5-11.1v-5.1c0-6.5 5.5-12 12-12h255.6c6.5 0 12 5.5 12 12v2.3c-0.5 4.6-0.7 9.3-0.7 13.9 0 27.7 8.7 54.5 24.6 75.2 6.6 8.6 14.2 16 22.6 22 0 0 26.7 17.8 60 17.8h60.8c21.3 0 41.5 8.4 56.7 23.7 15.3 15.3 23.7 35.4 23.7 56.7v403z" fill="#45484C" /></svg>

);


export function MainIcon()
{
    return(
        <Icon as={IconProps}></Icon>
    )
}