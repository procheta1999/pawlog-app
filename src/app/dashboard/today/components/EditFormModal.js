"use client";

import React from 'react';
import Modal from '../../components/Modal';
const EditFormModal=({openEditModal,handleCloseEditModal, formSchema, onSubmit})=>{
    return(
        <Modal open={openEditModal} onClose={handleCloseEditModal} isForm={true} formSchema={formSchema} onSubmit={onSubmit}/>
    )
}
export default EditFormModal;