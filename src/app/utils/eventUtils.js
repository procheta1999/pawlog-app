export const CARE_EVENT_TYPES = [
    "meal",
    "walk",
    "potty",
    "medication",
    "sleep",
    "grooming",
    "vet_visit",
    "weight",
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
export const careSchedule = [
    { field: 'eventType', value: 'meal', type: 'dropdown', category: 'event' },
    { field: 'description', value: '', type: 'input', category: 'input' },
    { field: 'eventTime', value: '', type: 'timePicker', category: 'time' },
    { field: 'notes', value: '', type: 'input', category: 'input' },
]
