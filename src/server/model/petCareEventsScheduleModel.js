import mongoose from 'mongoose';

const petCareEventsScheduleSchema = new mongoose.Schema(
  {
    petId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PetProfile',
      required: true,
      index: true,
    },
    petCareScheduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PetCareSchedule',
      default: null,
    },
    date: { type: Date, required: true, index: true },
    eventType: { type: String, required: true },
    description: { type: String, default: '' },
    eventTime: { type: Date, required: true },
    timeCertainty: { type: String, default: 'exact' },
    status: { type: String, default: 'scheduled' },
    changeCount: { type: Number, default: 0 },
    quantityDetails: { type: String, default: '' },
    notes: { type: String, default: '' },
  },
  { timestamps: true },
);

petCareEventsScheduleSchema.index(
  { petId: 1, date: 1, petCareScheduleId: 1 },
  { unique: true, sparse: true },
);

const PetCareEventsSchedule =
  mongoose.models.PetCareEventsSchedule ||
  mongoose.model(
    'PetCareEventsSchedule',
    petCareEventsScheduleSchema,
    'petCareEventsSchedule',
  );

export default PetCareEventsSchedule;
