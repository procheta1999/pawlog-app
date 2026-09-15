import { Box, Modal as MuiModal, Typography } from '@mui/material';
import Form from './Form';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: 'calc(100% - 2rem)', sm: 400 },
  maxHeight: 'calc(100vh - 2rem)',
  overflowY: 'auto',
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

export default function Modal({ open, onClose, isForm=false, formSchema={}, onSubmit=()=>{} }) {
  return (
    <MuiModal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        {isForm ? <Form schema={formSchema} onSubmitDetails={onSubmit}/>: (<><Typography id="modal-modal-title" variant="h6" component="h2">
                  Text in a modal
              </Typography><Typography id="modal-modal-description" sx={{ mt: 2 }}>
                      Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
                  </Typography></>)}
      </Box>
    </MuiModal>
  );
}
