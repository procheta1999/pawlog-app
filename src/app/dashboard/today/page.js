"use client";

import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import ProfileCard from "./components/ProfileCard";
import EditFormModal from './components/EditFormModal';
import TimelineCard from './components/TimelineCard';
import { useProfile } from '@/app/utils/ProfileContext';
export default function TodayPage() {
    const [openEditModal, setOpenEditModal]=useState(false);
    const { schema, name, metadata } = useProfile();
    const handleOpenEditModal=(state)=>{
        setOpenEditModal(state);
    }
    const handleCloseEditModal=()=>
    {
        handleOpenEditModal(false);
    }
    return (
        <Grid container spacing={2} sx={{mt:5}}>
            <Grid size={{ xs: 12, md: 6 }}>
                <ProfileCard handleOpenEditModal={handleOpenEditModal} nameOfPet={name} metadataOfPet={metadata}/>
                <EditFormModal openEditModal={openEditModal} handleCloseEditModal={handleCloseEditModal} formSchema={schema}/>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
                <TimelineCard />
            </Grid>
        </Grid>
    );
}