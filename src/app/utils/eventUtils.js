"use client";
import dayjs from 'dayjs';

export const CARE_EVENT_TYPES = [
    "meal",
    "walk",
    "potty",
    "medication",
    "sleep",
    "grooming",
    "vet_visit",
    "other",
];
export const TIME_PRECISIONS = [
    "exact",
    "approximate",
    "date_only",
    "unknown",
];

export const CARE_EVENT_STATUSES = [
    "confirmed",
    "partial",
    "in_review",
    "scheduled",
    "missed",
    "unknown",
    "conflicted",
];

export const CATEGORY_OPTIONS = {
    event: CARE_EVENT_TYPES,
    timeCertainty: TIME_PRECISIONS,
    status: CARE_EVENT_STATUSES,
};
export const careSchema = [
    { field: 'eventType', value: 'meal', type: 'dropdown', category: 'event' },
    { field: 'description', value: '', type: 'input', category: 'input' },
    { field: 'eventDate', value: '', type: 'datePicker', category: 'date' },
    { field: 'eventTime', value: '', type: 'timePicker', category: 'time' },
    { field: 'timeCertainty', value: 'exact', type: 'radio', category: 'timeCertainty' },
    { field: 'status', value: 'confirmed', type: 'dropdown', category: 'status' },
    { field: 'quantityDetails', value: '', type: 'input', catergory: 'input' },
    { field: 'notes', value: '', type: 'input', category: 'input' },
];
export const careScheduleSchema = [
    { field: 'eventType', value: 'meal', type: 'dropdown', category: 'event' },
    { field: 'description', value: '', type: 'input', category: 'input' },
    { field: 'eventTime', value: '', type: 'timePicker', category: 'time' },
    { field: 'notes', value: '', type: 'input', category: 'input' },
];

export const getCareScheduleFieldValue = (field, careSchedule) => {
    if (field.field === 'eventTime') {
        return dayjs(careSchedule.eventTime);
    }

    return careSchedule[field.field] ?? field.value;
};

export const getCareScheduleFormSchema = (careSchedule) => {
    return careScheduleSchema.map((field) => ({
        ...field,
        value: getCareScheduleFieldValue(field, careSchedule),
    }));
};

export const getCareEventFieldValue = (field, careEvent) => {
    if (field.field === 'eventDate') {
        return dayjs(careEvent.eventDate);
    }

    if (field.field === 'eventTime') {
        return dayjs(careEvent.eventTime);
    }

    return careEvent[field.field] ?? field.value;
};

export const getCareEventFormSchema = (careEvent) => {
    return careSchema.map((field) => ({
        ...field,
        disabled: field.field === 'eventType' || field.disabled,
        value: getCareEventFieldValue(field, careEvent),
    }));
};

const getTimeOfDayValue = (eventTime) => {
    const time = dayjs(eventTime);
    return (time.hour() * 60 * 60) + (time.minute() * 60) + time.second();
};

export const sortCareSchedulesByTime = (careSchedules) => {
    return [...careSchedules].sort((firstSchedule, secondSchedule) => (
        getTimeOfDayValue(firstSchedule.eventTime)
        - getTimeOfDayValue(secondSchedule.eventTime)
    ));
};

export const formatCareEventType = (eventType) => {
    return eventType.replaceAll('_', ' ').replace(/\b\w/g, (character) => character.toUpperCase());
};

export const getCareScheduleTimelineItems = (
    careSchedules,
    eventIcons,
    fallbackIcon,
) => {
    return sortCareSchedulesByTime(careSchedules).map((schedule) => ({
        ...schedule,
        sourceEvent: schedule,
        id: schedule.id,
        time: dayjs(schedule.eventTime).format('HH:mm'),
        title: schedule.description || formatCareEventType(schedule.eventType),
        description: schedule.notes || formatCareEventType(schedule.eventType),
        status: 'Scheduled',
        statusClass: 'scheduled',
        icon: eventIcons[schedule.eventType] || fallbackIcon,
    }));
};

export const sortCareEventsByTime = (careEvents) => {
    return [...careEvents].sort((firstEvent, secondEvent) => (
        new Date(firstEvent.eventTime) - new Date(secondEvent.eventTime)
    ));
};

export const getCareEventTimelineItems = (
    careEvents,
    statusDetails,
    eventIcons,
    fallbackIcon,
) => {
    return sortCareEventsByTime(careEvents).map((event) => {
        const status = statusDetails[event.status] || {
            label: formatCareEventType(event.status),
            className: 'needsReview',
        };

        return {
            ...event,
            sourceEvent: event,
            time: new Date(event.eventTime).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
            }),
            title: event.description || formatCareEventType(event.eventType),
            description: event.quantityDetails || event.notes || formatCareEventType(event.eventType),
            status: status.label,
            statusClass: status.className,
            icon: eventIcons[event.eventType] || fallbackIcon,
        };
    });
};
