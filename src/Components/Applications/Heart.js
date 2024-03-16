import React from "react";
import {FaHeart, FaRegHeart} from 'react-icons/fa';
import { collection, query } from "firebase/firestore";
import { useSelector } from "react-redux";
import { db } from "../../helpers/firebase_init";
import { where, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";


export default function Heart({cardID, isLiked ,updateCallBack})
{

    const user = useSelector((state) => state.CurrentUser.value);

    /*
    useEffect(() => {

        const checkIfLiked = async () => {
            const q = query(collection(db, `Cards/${cardID}/Likes`), where("uid","==",user.uid));
            const querySnapshot = await getDocs(q);

            setLiked(!querySnapshot.empty);
        };

        checkIfLiked();

        console.log("I should change");

    }, [cardID]);
    */
    
    const likePost = async () => {

        const userRef = collection(db, `Cards/${cardID}/Likes`);

        const userData = {
          uid:user.uid
        };
    
        addDoc(userRef, userData)
        .then(() => {console.log("like!"); updateCallBack()})
        .catch((error) => console.error("Error trying to like the card :( : ",error));
    }


    const unlikePost = async () => {

        const q = query(collection(db, `Cards/${cardID}/Likes`), where("uid","==",user.uid));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((document) => {
            const docRef = doc(db, `Cards/${cardID}/Likes`, document.id);
            deleteDoc(docRef)
            .then(() => {console.log("unliked :("); updateCallBack()})
            .catch((error) => console.error("Error trying to not like :/ : ",error));
        });
    }

    

    return(
        <button onClick={(e) => {e.stopPropagation();}}
        style={{background:"transparent", border:"none", cursor:"pointer"}}>
            {isLiked ? <FaHeart color="red" onClick={unlikePost} /> : <FaRegHeart onClick={likePost}/>}
        </button>
    )
}