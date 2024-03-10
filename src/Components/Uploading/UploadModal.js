import React from "react";
import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, FormControl, FormLabel, Input, ModalFooter} from "@chakra-ui/react";
import './UploadModal.css'
import UploadComponent from "./UploadComponent";
import { useDispatch } from "react-redux";
import { update_form } from "./modalSlice";
import { useSelector } from "react-redux";
//Modal to handle form input, whe the "Upload button is clicked"
//onChange={event => setEmail(event.currentTarget.value)}
export default function UploadModal({handleOpen, handleClose, index})
{

  //const editing = useSelector((state)=> state.editing.value);
  const modal = useSelector((state)=> state.modal.value);

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
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input onChange={event => dispatch(update_form({name: event.currentTarget.value}))} placeholder='First name' defaultValue={modal.name.split(" ")[0]}/>
            </FormControl>

            <FormControl mt={6}>
              <FormLabel>Notes</FormLabel>
              <Input onChange={event => dispatch(update_form({notes:event.currentTarget.value}))} defaultValue={modal.notes} />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <UploadComponent index={index} onClose={handleClose}></UploadComponent>
            <Button onClick={()=>{handleClose();}}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
    )
}