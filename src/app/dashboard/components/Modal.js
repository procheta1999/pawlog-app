import { Box, Modal as MuiModal, Typography } from '@mui/material';
import Form from './Form';
import styles from './Modal.module.css';

export default function Modal({ open, onClose, isForm=false, formSchema={}, onSubmit=()=>{} , title=""}) {
  return (
    <MuiModal
      open={open}
      onClose={onClose}
      aria-labelledby="edit-profile-modal-title"
      aria-describedby="edit-profile-modal-description"
    >
      <Box className={styles.modalContent}>
        {isForm ? <Form schema={formSchema} onSubmitDetails={onSubmit} formTitle={title}/>: (<><Typography id="modal-modal-title" variant="h6" component="h2">
                  Text in a modal
              </Typography><Typography id="modal-modal-description" className={styles.description}>
                      Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
                  </Typography></>)}
      </Box>
    </MuiModal>
  );
}
