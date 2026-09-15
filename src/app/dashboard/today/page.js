"use client";

import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import ProfileCard from "./components/ProfileCard";
import EditFormModal from './components/EditFormModal';
import TimelineCard from './components/TimelineCard';
import { useProfile } from '@/app/utils/ProfileContext';
export default function TodayPage() {
    const [openEditModal, setOpenEditModal]=useState(false);
    const { schema, name, metadata, loading, setProfile } = useProfile();
    const updateProfile=async (updatedSchema)=>{
        const profileData = updatedSchema.reduce((profile, field) => ({
            ...profile,
            [field.field]: field.value,
        }), {});

        const response = await fetch('/api/profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(profileData),
        });

        if (!response.ok) {
            throw new Error('Failed to update profile');
        }

        const updatedProfile = await response.json();
        setProfile({ ...updatedProfile, loading: false });
        handleCloseEditModal();
    };
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
                <ProfileCard handleOpenEditModal={handleOpenEditModal} nameOfPet={name} metadataOfPet={metadata} dataLoadingState={loading}/>
                <EditFormModal openEditModal={openEditModal} handleCloseEditModal={handleCloseEditModal} formSchema={schema} onSubmit={updateProfile} title="Juno's details"/>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
                <TimelineCard />
            </Grid>
        </Grid>
    );
}
