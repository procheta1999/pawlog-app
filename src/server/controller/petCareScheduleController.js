import {
  deleteCareSchedule,
  getCareSchedule,
  updateCareSchedule,
} from '../services/petCareScheduleService';

function isValidCareScheduleEvent(event) {
  return Boolean(event)
    && typeof event === 'object'
    && typeof event.eventType === 'string'
    && event.eventType.length > 0
    && typeof event.eventTime === 'string'
    && !Number.isNaN(Date.parse(event.eventTime))
    && (event.description === undefined || typeof event.description === 'string')
    && (event.notes === undefined || typeof event.notes === 'string')
    && (event.id === undefined || typeof event.id === 'string');
}

export async function getCareScheduleController() {
  try {
    const data = await getCareSchedule();
    return { data, status: 200 };
  } catch (error) {
    return {
      error: error.message || 'Failed to fetch care schedule',
      status: error.status || 500,
    };
  }
}

export async function updateCareScheduleController(request) {
  try {
    const body = await request.json();

    if (!isValidCareScheduleEvent(body)) {
      return {
        error: 'eventType and eventTime are required; description and notes must be strings when provided',
        status: 400,
      };
    }

    const data = await updateCareSchedule(body);
    return { data, status: 200 };
  } catch (error) {
    return {
      error: error.message || 'Failed to save care schedule',
      status: error.status || 500,
    };
  }
}

export async function deleteCareScheduleController(eventId) {
  if (!eventId) {
    return { error: 'Care schedule id is required', status: 400 };
  }

  try {
    const data = await deleteCareSchedule(eventId);
    return { data, status: 200 };
  } catch (error) {
    return {
      error: error.message || 'Failed to delete care schedule',
      status: error.status || 500,
    };
  }
}
