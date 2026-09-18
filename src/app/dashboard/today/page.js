"use client";

import React, { useCallback, useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import ProfileCard from "./components/ProfileCard";
import EditFormModal from './components/EditFormModal';
import ConflictResolutionModal from './components/ConflictResolutionModal';
import TimelineCard from './components/TimelineCard';
import { useProfile } from '@/app/utils/ProfileContext';
import {
    careScheduleSchema,
    careSchema,
    getCareEventFormSchema,
    getCareScheduleFormSchema,
    sortCareEventsByTime,
    sortCareSchedulesByTime,
} from '@/app/utils/eventUtils';
import CareScheduleCard from './components/CareScheduleCard';
import { useCareEvents } from '@/app/utils/EventsContext';

export default function TodayPage() {
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openCareModal, setOpenCareModal] = useState(false);
    const [openCareScheduleModal, setOpenCareSchedule] = useState(false);
    const [careSchedules, setCareSchedules] = useState([]);
    const [careSchedulesLoading, setCareSchedulesLoading] = useState(true);
    const [editingCareSchedule, setEditingCareSchedule] = useState(null);
    const [careEvents, setCareEvents] = useState([]);
    const [careEventsLoading, setCareEventsLoading] = useState(true);
    const [editingCareEvent, setEditingCareEvent] = useState(null);
    const [conflictingCareEvents, setConflictingCareEvents] = useState(null);
    const { schema, name, metadata, loading, setProfile } = useProfile();
    const { careEventsStats, setEventsCount } = useCareEvents();
    const getCareSchedules = async () => {
        const response = await fetch('/api/care-schedule', {
            cache: 'no-store',
        });

        if (!response.ok) {
            throw new Error('Failed to fetch care schedule');
        }

        return response.json();
    };
    const getCareEventsStatusCounts = useCallback(async () => {
        const response = await fetch('/api/care-events/status-counts', {
            cache: 'no-store',
        });

        if (!response.ok) {
            throw new Error('Failed to fetch care event status counts');
        }

        setEventsCount(await response.json());
    }, [setEventsCount]);
    const getCareEvents = useCallback(async () => {
        const response = await fetch('/api/care-events', {
            cache: 'no-store',
        });

        if (!response.ok) {
            throw new Error('Failed to fetch care events');
        }

        const events = await response.json();
        await getCareEventsStatusCounts();

        return events;
    }, [getCareEventsStatusCounts]);
    useEffect(() => {
        getCareSchedules()
            .then(setCareSchedules)
            .catch(() => setCareSchedules([]))
            .finally(() => setCareSchedulesLoading(false));
        getCareEvents()
            .then(setCareEvents)
            .catch(() => setCareEvents([]))
            .finally(() => setCareEventsLoading(false));
    }, [getCareEvents]);
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

            return sortCareSchedulesByTime(schedules);
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
    const persistCareEvent = async (event, eventId) => {
        const response = await fetch('/api/care-events', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(eventId ? { ...event, id: eventId } : event),
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

            return sortCareEventsByTime(events);
        });
        await getCareEventsStatusCounts();
        return savedEvent;
    };
    const handleCloseConflictResolutionModal = () => {
        setConflictingCareEvents(null);
    };
    const saveCareEvent = async (eventSchema) => {
        const event = eventSchema.reduce((entry, field) => ({
            ...entry,
            [field.field]: field.value,
        }), {});

        const requiresConflictResolution = Number(editingCareEvent?.changeCount) > 0;

        if (requiresConflictResolution) {
            setConflictingCareEvents({ recordA: editingCareEvent, recordB: event });
            handleCloseCareModal();
            return;
        }

        await persistCareEvent(event, editingCareEvent?.id);
        handleCloseCareModal();
    };
    const handleConflictResolution = async (resolution) => {
        if (!conflictingCareEvents) {
            return;
        }

        if (resolution === 'recordB') {
            await persistCareEvent(
                conflictingCareEvents.recordB,
                conflictingCareEvents.recordA.id,
            );
        }

        if (resolution === 'keepBoth') {
            await persistCareEvent(conflictingCareEvents.recordB);
        }

        handleCloseConflictResolutionModal();
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
        await getCareEventsStatusCounts();
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
                    <ProfileCard handleOpenEditModal={handleOpenEditModal} nameOfPet={name} metadataOfPet={metadata} dataLoadingState={loading} eventStats={careEventsStats} />
                    <EditFormModal openEditModal={openEditModal} handleCloseEditModal={handleCloseEditModal} formSchema={schema} onSubmit={updateProfile} title={`${name || 'Your pet'}'s details`} />
                </Grid>
                <Grid size={12}>
                    <CareScheduleCard
                        handleOpenCareScheduleModal={handleOpenCareScheduleModal}
                        careSchedules={careSchedules}
                        dataLoadingState={careSchedulesLoading}
                        onEventMenuAction={handleCareScheduleMenuAction}
                    />
                    <EditFormModal key={editingCareSchedule?.id || 'new-care-schedule'} openEditModal={openCareScheduleModal} handleCloseEditModal={handleCloseCareScheduleModal} formSchema={careScheduleFormSchema} onSubmit={saveCareSchedule} title={`${name || 'Your pet'}'s care schedule`} />
                </Grid>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
                <TimelineCard
                    handleOpenCareModal={handleOpenCareModal}
                    careEvents={careEvents}
                    dataLoadingState={careEventsLoading}
                    isCareScheduleEmpty={careSchedules.length === 0}
                    onEventMenuAction={handleCareEventMenuAction}
                />
                <EditFormModal key={editingCareEvent?.id || 'new-care-event'} openEditModal={openCareModal} handleCloseEditModal={handleCloseCareModal} formSchema={careEventFormSchema} onSubmit={saveCareEvent} title="Record Care Event" />
                <ConflictResolutionModal
                    open={Boolean(conflictingCareEvents)}
                    recordA={conflictingCareEvents?.recordA}
                    recordB={conflictingCareEvents?.recordB}
                    onClose={handleCloseConflictResolutionModal}
                    onResolve={handleConflictResolution}
                />
            </Grid>
        </Grid>
    );
}
