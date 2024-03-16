import React, { useEffect } from "react";
import { Button } from "@chakra-ui/react";
import { FcGoogle } from "react-icons/fc";
import { auth, db } from "../../helpers/firebase_init"
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { set_user } from "../userSlice";

export default function LoginPage(){

    const dispatch = useDispatch();


    const checkForUser = async (newLogIn) =>{

        const uid = newLogIn.uid;
        const userRef = doc(db, 'users', uid);
        const userSnap = await getDoc(userRef);

        if(!userSnap.exists())
        {
            await setDoc(userRef, {
                name:newLogIn.displayName,
                uid:uid
            });

            console.log("New User created");
        }else
        {
            console.log("User already exists");
        }

    }

    useEffect(()=>{

        const unsubscribe = onAuthStateChanged(auth, async (user) =>{
            
            if(user){
                
                dispatch(set_user({name: user.displayName, uid: user.uid}));
            }

        });

        return () => unsubscribe();

    }, [dispatch])


    const signInWithGoogle = () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
        .then((result) => {

            const user = result.user;

            checkForUser(user);

            dispatch(set_user({name: user.displayName, uid: user.uid}))
        }).catch((error) => {

            console.error(error);
        });
    }

    return (
    <>
    
        <div style={{display:"flex", flexDirection:"column", alignItems:"center", height:"400px"}}>
            <div style={{textAlign:"center", fontFamily:"roboto", margin:"auto", height:"40%", fontSize:"12em"}}>
                Hi there.
            </div>
            <Button color={"white"} rightIcon={<FcGoogle size={40}/>}  onClick={() => signInWithGoogle()} margin={"auto"} width={"30%"} height={"20%"}>Login with google</Button>
        </div>
    
    </>
    )
}