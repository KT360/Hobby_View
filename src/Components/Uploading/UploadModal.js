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



//Modal to handle form input, when the "Upload button is clicked"
export default function UploadModal({handleOpen, handleClose})
{


  const modal = useSelector((state)=> state.modal.value);
  const page = useSelector((state) => state.window.value);
  const user = useSelector((state) =>  state.CurrentUser.value);
  const update = useSelector((state) => state.update_page.value);
  const [previewImage, setPreview] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);

  const dispatch = useDispatch();

  //When an image is selected, set state, then read image file to dispaly a preview
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

  //Add user post to database
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

      //Create a reference in storage
      const imageRef = ref(storage, `UploadedImages/${uploadFile.name}`);
      //Get data/snapshot once uploaded
      const snapshot = await uploadBytes(imageRef, uploadFile);
      //Get url
      const imageURL = await getDownloadURL(snapshot.ref);
      //Add a new post using url
      addCard(imageURL);

      }catch (error)
      {
          console.error("Error uploading card and updating Firestore: ", error);
      }
  };

  /*
    Once user clicks 'Save', set global state of loading to true,
    Upload image and Card data
    Close modal, stop loading
    Trigger a page update by switching the current update state, (MainPage depends on update, so it will trigger useEffect)
  */
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