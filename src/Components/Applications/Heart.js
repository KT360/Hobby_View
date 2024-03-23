import React from "react";
import {FaHeart, FaRegHeart} from 'react-icons/fa';
import { collection, query } from "firebase/firestore";
import { useSelector } from "react-redux";
import { db } from "../../helpers/firebase_init";
import { where, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";

//Heart component gets it's state from the parent, makes refresh easier
export default function Heart({cardID, isLiked ,updateCallBack})
{

    const user = useSelector((state) => state.CurrentUser.value);
    
    //Add user to list of likes
    const likePost = async () => {

        const userRef = collection(db, `Cards/${cardID}/Likes`);

        const userData = {
          uid:user.uid
        };
    
        addDoc(userRef, userData)
        .then(() => {console.log("like!"); updateCallBack()}) //After a like action perform the callback passed from parent (set the update flag for the page to re-render)
        .catch((error) => console.error("Error trying to like the card :( : ",error));
    }


    //To unlike the post, filter for the user's ID in the card collection, then delete the document containing that ID
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