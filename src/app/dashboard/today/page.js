"use client";

import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import ProfileCard from "./components/ProfileCard";
import EditFormModal from './components/EditFormModal';
import TimelineCard from './components/TimelineCard';
import { useProfile } from '@/app/utils/ProfileContext';
import { careSchedule, careSchema } from '@/app/utils/eventUtils';
import CareScheduleCard from './components/CareScheduleCard';

export default function TodayPage() {
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openCareModal, setOpenCareModal] = useState(false);
    const [openCareScheduleModal, setOpenCareSchedule] = useState(false);
    const [careSchedules, setCareSchedules] = useState([]);
    const { schema, name, metadata, loading, setProfile } = useProfile();
    const updateProfile = async (updatedSchema) => {
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
    const handleOpenEditModal = (state) => {
        setOpenEditModal(state);
    }
    const handleOpenCareModal = (state) => {
        setOpenCareModal(state);
    }
    const handleCloseEditModal = () => {
        handleOpenEditModal(false);
    }
    const handleCloseCareModal = () => {
        handleOpenCareModal(false);
    }
    const handleOpenCareScheduleModal = (state) => {
        setOpenCareSchedule(state);
    }
    const handleCloseCareScheduleModal = () => {
        handleOpenCareScheduleModal(false);
    }
    const saveCareSchedule = (scheduleSchema) => {
        const schedule = scheduleSchema.reduce((entry, field) => ({
            ...entry,
            [field.field]: field.value,
        }), {});

        setCareSchedules((currentSchedules) => [
            ...currentSchedules,
            { ...schedule, id: crypto.randomUUID() },
        ]);
        handleCloseCareScheduleModal();
    };
    return (
        <Grid container spacing={2} sx={{ mt: 5 }}>
            <Grid container direction="column" spacing={2} size={{ xs: 12, md: 6 }}>
                <Grid size={12}>
                    <ProfileCard handleOpenEditModal={handleOpenEditModal} nameOfPet={name} metadataOfPet={metadata} dataLoadingState={loading} />
                    <EditFormModal openEditModal={openEditModal} handleCloseEditModal={handleCloseEditModal} formSchema={schema} onSubmit={updateProfile} title={`${name || 'Your pet'}'s details`} />
                </Grid>
                <Grid size={12}>
                    <CareScheduleCard
                        handleOpenCareScheduleModal={handleOpenCareScheduleModal}
                        careSchedules={careSchedules}
                    />
                    <EditFormModal openEditModal={openCareScheduleModal} handleCloseEditModal={handleCloseCareScheduleModal} formSchema={careSchedule} onSubmit={saveCareSchedule} title={`${name || 'Your pet'}'s care schedule`} />
                </Grid>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
                <TimelineCard handleOpenCareModal={handleOpenCareModal} />
                <EditFormModal openEditModal={openCareModal} handleCloseEditModal={handleCloseCareModal} formSchema={careSchema} onSubmit={updateProfile} title="Record Care Event" />
            </Grid>
        </Grid>
    );
}
