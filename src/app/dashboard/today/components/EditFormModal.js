"use client";

import React from 'react';
import Modal from '../../components/Modal';
const EditFormModal=({openEditModal,handleCloseEditModal, formSchema})=>{
    return(
        <Modal open={openEditModal} onClose={handleCloseEditModal} isForm={true} formSchema={formSchema}/>
    )
}
export default EditFormModal;