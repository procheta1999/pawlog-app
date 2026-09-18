import PetCareEventsSchedule from '../model/petCareEventsScheduleModel';
import PetCareSchedule from '../model/petCareScheduleModel';
import connectDB from '../config/db';
import { getCurrentPetId } from './petProfileService';

function getDayRange(date = new Date()) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return { start, end };
}

function eventNotFoundError() {
  const error = new Error('Care event was not found');
  error.status = 404;
  return error;
}

function combineDateAndTime(dateValue, timeValue) {
  const date = new Date(dateValue || timeValue || Date.now());
  const time = new Date(timeValue || dateValue || Date.now());
  date.setHours(time.getHours(), time.getMinutes(), time.getSeconds(), 0);
  return date;
}

function scheduleEventTimeForToday(schedule, date = new Date()) {
  return combineDateAndTime(date, schedule.eventTime);
}

function getAutomaticStatus(eventTime) {
  return eventTime <= new Date() ? 'in_review' : 'scheduled';
}

function scheduleEventData(schedule, date = new Date()) {
  const eventTime = scheduleEventTimeForToday(schedule, date);

  return {
    eventType: schedule.eventType,
    description: schedule.description || '',
    eventTime,
    timeCertainty: 'exact',
    status: getAutomaticStatus(eventTime),
    quantityDetails: '',
    notes: schedule.notes || '',
  };
}

function getEventData(event) {
  const eventTime = combineDateAndTime(event.eventDate, event.eventTime);

  return {
    date: getDayRange(event.eventDate || eventTime).start,
    eventType: event.eventType,
    description: event.description || '',
    eventTime,
    timeCertainty: event.timeCertainty || 'exact',
    status: event.status || getAutomaticStatus(eventTime),
    quantityDetails: event.quantityDetails || '',
    notes: event.notes || '',
  };
}

function formatEvent(event) {
  return {
    id: event._id.toString(),
    petId: event.petId.toString(),
    petCareScheduleId: event.petCareScheduleId?.toString() || null,
    eventDate: event.date.toISOString(),
    eventType: event.eventType,
    description: event.description,
    eventTime: event.eventTime.toISOString(),
    timeCertainty: event.timeCertainty,
    status: event.status,
    changeCount: event.changeCount ?? 0,
    quantityDetails: event.quantityDetails,
    notes: event.notes,
  };
}

async function createTodayCareEventsFromSchedule(petId, start, end) {
  const existingCount = await PetCareEventsSchedule.countDocuments({
    petId,
    date: { $gte: start, $lt: end },
  });

  if (existingCount > 0) {
    return;
  }

  const schedules = await PetCareSchedule.find({ petId }).lean();
  const events = schedules.map((schedule) => ({
    petId,
    petCareScheduleId: schedule._id,
    date: start,
    changeCount: 0,
    ...scheduleEventData(schedule, start),
  }));

  if (events.length) {
    try {
      await PetCareEventsSchedule.bulkWrite(
        events.map((event) => ({
          updateOne: {
            filter: {
              petId: event.petId,
              date: event.date,
              petCareScheduleId: event.petCareScheduleId,
            },
            update: { $setOnInsert: event },
            upsert: true,
          },
        })),
      );
    } catch (error) {
      if (error.code !== 11000) {
        throw error;
      }
    }
  }
}

export async function getTodayCareEvents() {
  await connectDB();

  const petId = await getCurrentPetId('A pet profile is required before managing care events');
  const { start, end } = getDayRange();
  await createTodayCareEventsFromSchedule(petId, start, end);

  const events = await PetCareEventsSchedule.find({
    petId,
    date: { $gte: start, $lt: end },
  }).sort({ eventTime: 1, createdAt: 1 }).lean();

  return events.map(formatEvent);
}

export async function getTodayCareEventStatusCounts() {
  await connectDB();

  const petId = await getCurrentPetId('A pet profile is required before managing care events');
  const { start, end } = getDayRange();
  await createTodayCareEventsFromSchedule(petId, start, end);
  const dateFilter = {
    petId,
    date: { $gte: start, $lt: end },
  };
  const [recorded, scheduled, inReview] = await Promise.all([
    PetCareEventsSchedule.countDocuments({
      ...dateFilter,
      status: { $nin: ['scheduled', 'in_review', 'unknown'] },
    }),
    PetCareEventsSchedule.countDocuments({ ...dateFilter, status: 'scheduled' }),
    PetCareEventsSchedule.countDocuments({ ...dateFilter, status: 'in_review' }),
  ]);

  return { recorded, scheduled, inReview };
}

export async function updateCareEvent(event) {
  await connectDB();

  const petId = await getCurrentPetId('A pet profile is required before managing care events');
  const id = event.id || event._id;
  const data = getEventData(event);

  if (id) {
    const updated = await PetCareEventsSchedule.findOneAndUpdate(
      { _id: id, petId },
      {
        $set: data,
        $inc: { changeCount: 1 },
      },
      { new: true, runValidators: true },
    ).lean();

    if (!updated) throw eventNotFoundError();
    return formatEvent(updated);
  }

  const created = await PetCareEventsSchedule.create({ petId, ...data });
  return formatEvent(created.toObject());
}

export async function deleteCareEvent(eventId) {
  await connectDB();

  const petId = await getCurrentPetId('A pet profile is required before managing care events');
  const deleted = await PetCareEventsSchedule.findOneAndDelete({ _id: eventId, petId }).lean();

  if (!deleted) throw eventNotFoundError();
  return { id: deleted._id.toString() };
}

export async function syncScheduleWithTodayEvent(schedule) {
  await connectDB();

  const { start, end } = getDayRange();
  const data = scheduleEventData(schedule, start);
  const existingEvent = await PetCareEventsSchedule.findOneAndUpdate(
    {
      petId: schedule.petId,
      petCareScheduleId: schedule._id,
      date: { $gte: start, $lt: end },
    },
    { date: start, ...data },
    { new: true },
  );

  if (!existingEvent) {
    await PetCareEventsSchedule.create({
      petId: schedule.petId,
      petCareScheduleId: schedule._id,
      date: start,
      ...data,
    });
  }
}

export async function deleteTodayEventForSchedule(petId, scheduleId) {
  await connectDB();

  const { start, end } = getDayRange();
  await PetCareEventsSchedule.deleteOne({
    petId,
    petCareScheduleId: scheduleId,
    date: { $gte: start, $lt: end },
  });
}
