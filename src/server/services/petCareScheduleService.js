import PetCareSchedule from '../model/petCareScheduleModel';
import connectDB from '../config/db';
import { getCurrentPetId } from './petProfileService';
import {
  deleteTodayEventForSchedule,
  syncScheduleWithTodayEvent,
} from './petCareEventsScheduleService';

function formatCareSchedule(event) {
  return {
    id: event._id.toString(),
    petId: event.petId.toString(),
    eventType: event.eventType,
    description: event.description,
    eventTime: event.eventTime.toISOString(),
    notes: event.notes,
  };
}

function getEventData(event) {
  return {
    eventType: event.eventType,
    description: event.description || '',
    eventTime: new Date(event.eventTime),
    notes: event.notes || '',
  };
}

export async function getCareSchedule() {
  await connectDB();

  const petId = await getCurrentPetId('A pet profile is required before saving a care schedule');
  const events = await PetCareSchedule.find({ petId })
    .sort({ eventTime: 1, createdAt: 1 })
    .lean();

  return events.map(formatCareSchedule);
}

export async function updateCareSchedule(event) {
  await connectDB();

  const petId = await getCurrentPetId('A pet profile is required before saving a care schedule');
  const eventData = getEventData(event);
  const eventId = event.id || event._id;

  if (eventId) {
    const updatedEvent = await PetCareSchedule.findOneAndUpdate(
      { _id: eventId, petId },
      eventData,
      { new: true, runValidators: true },
    ).lean();

    if (!updatedEvent) {
      const error = new Error('Care schedule event was not found');
      error.status = 404;
      throw error;
    }

    await syncScheduleWithTodayEvent(updatedEvent);
    return formatCareSchedule(updatedEvent);
  }

  const createdEvent = await PetCareSchedule.create({
    petId,
    ...eventData,
  });

  await syncScheduleWithTodayEvent(createdEvent);
  return formatCareSchedule(createdEvent.toObject());
}

export async function deleteCareSchedule(eventId) {
  await connectDB();

  const petId = await getCurrentPetId('A pet profile is required before saving a care schedule');
  const deletedEvent = await PetCareSchedule.findOneAndDelete({
    _id: eventId,
    petId,
  }).lean();

  if (!deletedEvent) {
    const error = new Error('Care schedule event was not found');
    error.status = 404;
    throw error;
  }

  await deleteTodayEventForSchedule(deletedEvent.petId, deletedEvent._id);
  return { id: deletedEvent._id.toString() };
}
