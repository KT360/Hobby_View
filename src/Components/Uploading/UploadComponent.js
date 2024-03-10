import './UploadModal.css';
import React from 'react';
import { Button } from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { update_form } from "./modalSlice";
import { set_update_page } from '../Pages/pageSlice';
import { set_loading } from './modeSlice';


import {getStorage, ref, uploadBytes, getDownloadURL} from "firebase/storage";
import {getFirestore, doc, updateDoc,getDoc} from "firebase/firestore";


//Pretty much the "Upload" and the "Save" button paired 
//Its in charge of handling the post to the server
export default function UploadComponent({ onClose, index, type }) {
    const page = useSelector((state) => state.window.value);

    const dispatch = useDispatch();
    const modal = useSelector((state) => state.modal.value);

    /*
    const [isReadyToSend, setIsReadyToSend] = useState(false);

    useEffect(() => {

        socket = io();
        socket.on('card updated', (response) => {
            console.log(response);
            dispatch(set_updated_page(true));
        });

        return () => {
            socket.disconnect();
        }
    }, []);

    useEffect(() => {
        if (isReadyToSend) {
            socket.emit('update', {pageID:page, cardID:index, mod_data:modal});
        }
    }, [isReadyToSend]);
    */

    const handleImageChange = (e) => {
        dispatch(update_form({imagePath: e.target.files[0]}));
    };
    
    const handleUpload = async () => {
        const storage = getStorage();
        const firestore = getFirestore();


        try {


            const docRef = doc(firestore, 'BlogData','pages');

            const currentPageData = (await getDoc(docRef)).data()[page];

            const imageRef = ref(storage, `UploadedImages/${modal.imagePath}`);

            const snapshot = await uploadBytes(imageRef, modal.imagePath);

            const imageURL = await getDownloadURL(snapshot.ref);

            if(currentPageData)
            {
                const updatedObjects = currentPageData.map((item, idx) => {
                    if(idx === index)
                    {
                        return {...item, imagePath:imageURL, name:modal.name, title:modal.title, notes:modal.notes};
                    }
                    return item;
                });

                // Update the document in Firestore
                await updateDoc(docRef, {
                    [page]: updatedObjects
                });

                console.log("Image uploaded and Firestore updated successfully.");

                dispatch(set_update_page(true))
            }else
            {
                console.error("Specified page does not exist in the Firestore document.");
            }
        }catch (error)
        {
            console.error("Error uploading image and updating Firestore: ", error);
        }
    };

    const handleClick = async () => {
        dispatch(set_loading(true));
        await handleUpload();
        onClose();
        dispatch(set_loading(false));
    };

    return (
        <>
            <label id="file-input" style={{ marginRight: 8, border: "1px solid #ccc", display: "inline-block", padding: "6px 12px", cursor: "pointer", background: "turquoise", borderRadius: "5px" }}>
                <input type="file" accept='image/*' onChange={handleImageChange} />
                    Upload
            </label>
            <label style={{marginRight:"6", textOverflow:"ellipsis"}}>{modal.imagePath.split("%")[1].split("?")[0]}</label>
            <Button onClick={handleClick} colorScheme='blue' mr={3}>
                Save
            </Button>

        </>
    )
}