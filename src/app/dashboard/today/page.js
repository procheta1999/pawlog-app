"use client";

import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import Grid from '@mui/material/Grid';
import ProfileCard from "./components/ProfileCard";
import EditFormModal from './components/EditFormModal';
import TimelineCard from './components/TimelineCard';
import { useProfile } from '@/app/utils/ProfileContext';
import { careScheduleSchema, careSchema } from '@/app/utils/eventUtils';
import CareScheduleCard from './components/CareScheduleCard';

function getCareScheduleFieldValue(field, careSchedule) {
    if (field.field === 'eventTime') {
        return dayjs(careSchedule.eventTime);
    }

    return careSchedule[field.field] ?? field.value;
}

function getCareScheduleFormSchema(careSchedule) {
    return careScheduleSchema.map((field) => ({
        ...field,
        value: getCareScheduleFieldValue(field, careSchedule),
    }));
}

function getCareEventFieldValue(field, careEvent) {
    if (field.field === 'eventDate') {
        return dayjs(careEvent.eventDate);
    }

    if (field.field === 'eventTime') {
        return dayjs(careEvent.eventTime);
    }

    return careEvent[field.field] ?? field.value;
}

function getCareEventFormSchema(careEvent) {
    return careSchema.map((field) => ({
        ...field,
        disabled: field.field === 'eventType' || field.disabled,
        value: getCareEventFieldValue(field, careEvent),
    }));
}

export default function TodayPage() {
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openCareModal, setOpenCareModal] = useState(false);
    const [openCareScheduleModal, setOpenCareSchedule] = useState(false);
    const [careSchedules, setCareSchedules] = useState([]);
    const [editingCareSchedule, setEditingCareSchedule] = useState(null);
    const [careEvents, setCareEvents] = useState([]);
    const [editingCareEvent, setEditingCareEvent] = useState(null);
    const { schema, name, metadata, loading, setProfile } = useProfile();
    const getCareSchedules = async () => {
        const response = await fetch('/api/care-schedule', {
            cache: 'no-store',
        });

        if (!response.ok) {
            throw new Error('Failed to fetch care schedule');
        }

        return response.json();
    };
    const getCareEvents = async () => {
        const response = await fetch('/api/care-events', {
            cache: 'no-store',
        });

        if (!response.ok) {
            throw new Error('Failed to fetch care events');
        }

        return response.json();
    };
    useEffect(() => {
        getCareSchedules()
            .then(setCareSchedules)
            .catch(() => setCareSchedules([]));
        getCareEvents()
            .then(setCareEvents)
            .catch(() => setCareEvents([]));
    }, []);
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
        setEditingCareEvent(null);
    }
    const handleOpenCareScheduleModal = (state) => {
        setOpenCareSchedule(state);
    }
    const handleCloseCareScheduleModal = () => {
        handleOpenCareScheduleModal(false);
        setEditingCareSchedule(null);
    }
    const saveCareSchedule = async (scheduleSchema) => {
        const schedule = scheduleSchema.reduce((entry, field) => ({
            ...entry,
            [field.field]: field.value,
        }), {});

        if (editingCareSchedule) {
            schedule.id = editingCareSchedule.id;
        }

        const response = await fetch('/api/care-schedule', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(schedule),
        });

        if (!response.ok) {
            throw new Error('Failed to save care schedule');
        }

        const savedSchedule = await response.json();
        setCareSchedules((currentSchedules) => {
            const hasExistingSchedule = currentSchedules.some(
                (currentSchedule) => currentSchedule.id === savedSchedule.id,
            );
            const schedules = hasExistingSchedule
                ? currentSchedules.map((currentSchedule) => (
                    currentSchedule.id === savedSchedule.id ? savedSchedule : currentSchedule
                ))
                : [...currentSchedules, savedSchedule];

            return schedules.sort(
                (firstSchedule, secondSchedule) => (
                    new Date(firstSchedule.eventTime) - new Date(secondSchedule.eventTime)
                ),
            );
        });
        setCareEvents(await getCareEvents());
        handleCloseCareScheduleModal();
    };
    const handleEditCareSchedule = (schedule) => {
        setEditingCareSchedule(schedule);
        handleOpenCareScheduleModal(true);
    };
    const deleteCareSchedule = async (schedule) => {
        const response = await fetch(`/api/care-schedule?id=${encodeURIComponent(schedule.id)}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Failed to delete care schedule');
        }

        const deletedSchedule = await response.json();
        setCareSchedules((currentSchedules) => (
            currentSchedules.filter((currentSchedule) => currentSchedule.id !== deletedSchedule.id)
        ));
        setCareEvents(await getCareEvents());
    };
    const handleCareScheduleMenuAction = async (schedule, action) => {
        if (action === 'edit') {
            handleEditCareSchedule(schedule);
        }

        if (action === 'delete') {
            await deleteCareSchedule(schedule);
        }
    };
    const saveCareEvent = async (eventSchema) => {
        const event = eventSchema.reduce((entry, field) => ({
            ...entry,
            [field.field]: field.value,
        }), {});

        if (editingCareEvent) {
            event.id = editingCareEvent.id;
        }

        const response = await fetch('/api/care-events', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(event),
        });

        if (!response.ok) {
            throw new Error('Failed to save care event');
        }

        const savedEvent = await response.json();
        setCareEvents((currentEvents) => {
            const exists = currentEvents.some((currentEvent) => currentEvent.id === savedEvent.id);
            const events = exists
                ? currentEvents.map((currentEvent) => (
                    currentEvent.id === savedEvent.id ? savedEvent : currentEvent
                ))
                : [...currentEvents, savedEvent];

            return events.sort((firstEvent, secondEvent) => (
                new Date(firstEvent.eventTime) - new Date(secondEvent.eventTime)
            ));
        });
        handleCloseCareModal();
    };
    const deleteCareEvent = async (event) => {
        const response = await fetch(`/api/care-events?id=${encodeURIComponent(event.id)}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Failed to delete care event');
        }

        const deletedEvent = await response.json();
        setCareEvents((currentEvents) => (
            currentEvents.filter((currentEvent) => currentEvent.id !== deletedEvent.id)
        ));
    };
    const handleCareEventMenuAction = async (event, action) => {
        if (action === 'edit') {
            setEditingCareEvent(event);
            handleOpenCareModal(true);
        }

        if (action === 'delete') {
            await deleteCareEvent(event);
        }
    };
    const careScheduleFormSchema = editingCareSchedule
        ? getCareScheduleFormSchema(editingCareSchedule)
        : careScheduleSchema;
    const careEventFormSchema = editingCareEvent
        ? getCareEventFormSchema(editingCareEvent)
        : careSchema;
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
                        onEventMenuAction={handleCareScheduleMenuAction}
                    />
                    <EditFormModal key={editingCareSchedule?.id || 'new-care-schedule'} openEditModal={openCareScheduleModal} handleCloseEditModal={handleCloseCareScheduleModal} formSchema={careScheduleFormSchema} onSubmit={saveCareSchedule} title={`${name || 'Your pet'}'s care schedule`} />
                </Grid>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
                <TimelineCard
                    handleOpenCareModal={handleOpenCareModal}
                    careEvents={careEvents}
                    onEventMenuAction={handleCareEventMenuAction}
                />
                <EditFormModal key={editingCareEvent?.id || 'new-care-event'} openEditModal={openCareModal} handleCloseEditModal={handleCloseCareModal} formSchema={careEventFormSchema} onSubmit={saveCareEvent} title="Record Care Event" />
            </Grid>
        </Grid>
    );
}
