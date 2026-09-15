"use client";

import React from 'react';
import Modal from '../../components/Modal';
const EditFormModal=({openEditModal,handleCloseEditModal, formSchema, onSubmit, title})=>{
    return(
        <Modal open={openEditModal} onClose={handleCloseEditModal} isForm={true} formSchema={formSchema} onSubmit={onSubmit} title={title}/>
    )
}
export default EditFormModal;