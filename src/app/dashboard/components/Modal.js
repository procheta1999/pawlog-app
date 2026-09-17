import { Box, Modal as MuiModal, Typography } from '@mui/material';
import Form from './Form';
import styles from './Modal.module.css';

export default function Modal({ open, onClose, isForm = false, formSchema = {}, onSubmit = () => { }, title = "" }) {
  return (
    <MuiModal
      open={open}
      onClose={onClose}
      aria-labelledby="edit-modal-title"
      aria-describedby="edit-modal-description"
    >
      <Box className={styles.modalContent}>
        {isForm ? (
          <>
            <Typography id="edit-modal-title" variant="h6" component="h2" sx={{ fontWeight: 700 }}>
              {title}
            </Typography>
            <Form schema={formSchema} onSubmitDetails={onSubmit} />
          </>
        ) : null}
      </Box>
    </MuiModal>
  );
}
