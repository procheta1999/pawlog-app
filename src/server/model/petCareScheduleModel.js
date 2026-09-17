import mongoose from 'mongoose';

const petCareScheduleSchema = new mongoose.Schema(
  {
    petId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PetProfile',
      required: true,
      index: true,
    },
    eventType: { type: String, required: true },
    description: { type: String, default: '' },
    eventTime: { type: Date, required: true },
    notes: { type: String, default: '' },
  },
  { timestamps: true },
);

const PetCareSchedule =
  mongoose.models.PetCareSchedule ||
  mongoose.model('PetCareSchedule', petCareScheduleSchema, 'petCareSchedule');

export default PetCareSchedule;
