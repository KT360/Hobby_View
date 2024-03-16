import React from "react";
import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, FormControl, FormLabel, ModalFooter} from "@chakra-ui/react";
import './UploadModal.css'
import { useDispatch, useSelector } from "react-redux";
import { update_form } from "./modalSlice";
import { Textarea } from "@chakra-ui/react";
import { FcImageFile } from "react-icons/fc";
import { set_update_page } from '../Pages/pageSlice';
import { set_loading } from './modeSlice';
import { Image } from "@chakra-ui/react";
import { useState } from "react";
import { db } from "../../helpers/firebase_init";
import { collection , addDoc} from "firebase/firestore";


import {getStorage, ref, uploadBytes, getDownloadURL} from "firebase/storage";



//Modal to handle form input, whe the "Upload button is clicked"
//onChange={event => setEmail(event.currentTarget.value)}
export default function UploadModal({handleOpen, handleClose, index})
{

  //const editing = useSelector((state)=> state.editing.value);
  const modal = useSelector((state)=> state.modal.value);
  const page = useSelector((state) => state.window.value);
  const user = useSelector((state) =>  state.CurrentUser.value);
  const update = useSelector((state) => state.update_page.value);
  const [previewImage, setPreview] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);

  const dispatch = useDispatch();
  //const [firstName, setFirstName] = useState(modal.name.split(" ")[0]);
  //const [lastName, setLastName] = useState(modal.name.split(" ")[1]);


  /*
  function updateName()
  {
    let newName = firstName+" "+lastName;

    dispatch(update_form({name: newName}))
  }
  */
  const handleImageChange = (e) => {

    const file = e.target.files[0];

    setUploadFile(file);
    

    if(file && file.type.startsWith('image/')){

      const reader = new FileReader();
      reader.onload = function(e){
        setPreview(e.target.result)
      };

      reader.readAsDataURL(file);

    }else{

      setPreview(null);

    }
  };

  const addCard = (url) =>{

    const cardsRef = collection(db, 'Cards');

    const cardData = {
      owner: user.uid,
      imagePath:url,
      Description:modal.notes,
      page:page
    };

    addDoc(cardsRef, cardData)
    .then(() => {console.log("Card added")})
    .catch((error) => console.error("Error adding card: ",error));
  }

  const handleUpload = async () => {
    const storage = getStorage();


    try {

      const imageRef = ref(storage, `UploadedImages/${uploadFile.name}`);

      const snapshot = await uploadBytes(imageRef, uploadFile);

      const imageURL = await getDownloadURL(snapshot.ref);

      addCard(imageURL);

      }catch (error)
      {
          console.error("Error uploading card and updating Firestore: ", error);
      }
  };

  const handleClick = async () => {
    dispatch(set_loading(true));
    await handleUpload();
    handleClose();
    dispatch(set_loading(false));
    dispatch(set_update_page(!update));
  };


    return(
    <>
      <Modal
        isOpen={handleOpen}
        onClose={handleClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Make a card</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl mt={6}>
              <FormLabel>Notes</FormLabel>
              <Textarea onChange={event => dispatch(update_form({notes:event.currentTarget.value}))} defaultValue={modal.notes}></Textarea>
            </FormControl>

            {previewImage ? 
            
            <div style={{width:"200px", height:"200px", 
            border:"1px solid #ccc", borderRadius:"16px", margin:"15px", 
            alignItems:"center", justifyContent:"center", display:"flex", 
            flexDirection:"column"}}>
              <Image src={previewImage} alt="placeholder"></Image>
              <label id="file-input" style={{ marginRight: 8, border: "1px solid #ccc", display: "inline-block", padding: "6px 12px", cursor: "pointer", background: "grey"}}>
                <input type="file" accept='image/*' onChange={handleImageChange} />
                    Upload
              </label>
            </div>

            :

            <div style={{width:"200px", height:"200px", border:"1px solid #ccc", 
            borderRadius:"16px", margin:"15px", alignItems:"center", 
            justifyContent:"center", display:"flex", flexDirection:"column"}}>
        
              <FcImageFile style={{margin:"auto"}} size={80}/>
              <label id="file-input" style={{ marginRight: 8, border: "1px solid #ccc", display: "inline-block", padding: "6px 12px", cursor: "pointer", background: "grey"}}>
                <input type="file" accept='image/*' onChange={handleImageChange} />
                    Upload
              </label>
            </div>
          
            }
          </ModalBody>

          <ModalFooter>
            <Button onClick={handleClick} colorScheme='blue' mr={3}>
              Save
            </Button>
            <Button onClick={()=>{handleClose();}}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
    )
}