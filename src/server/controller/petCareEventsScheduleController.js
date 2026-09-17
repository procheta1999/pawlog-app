import {
  deleteCareEvent,
  getTodayCareEvents,
  updateCareEvent,
} from '../services/petCareEventsScheduleService';

function isValidCareEvent(event) {
  return Boolean(event)
    && typeof event === 'object'
    && typeof event.eventType === 'string'
    && event.eventType.length > 0
    && typeof event.eventTime === 'string'
    && !Number.isNaN(Date.parse(event.eventTime));
}

export async function getCareEventsController() {
  try {
    return { data: await getTodayCareEvents(), status: 200 };
  } catch (error) {
    return { error: error.message || 'Failed to fetch care events', status: error.status || 500 };
  }
}

export async function updateCareEventController(request) {
  try {
    const body = await request.json();
    if (!isValidCareEvent(body)) {
      return { error: 'eventType and eventTime are required', status: 400 };
    }
    return { data: await updateCareEvent(body), status: 200 };
  } catch (error) {
    return { error: error.message || 'Failed to save care event', status: error.status || 500 };
  }
}

export async function deleteCareEventController(eventId) {
  if (!eventId) return { error: 'Care event id is required', status: 400 };

  try {
    return { data: await deleteCareEvent(eventId), status: 200 };
  } catch (error) {
    return { error: error.message || 'Failed to delete care event', status: error.status || 500 };
  }
}
