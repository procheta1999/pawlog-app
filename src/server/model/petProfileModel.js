import mongoose from 'mongoose';

const petProfileSchema = new mongoose.Schema({
  petName: { type: String, required: true },
  petBreed: { type: String, default: '' },
  petWeight: { type: String, default: '' },
  petAge: { type: String, default: '' },
});

const PetProfile =
  mongoose.models.PetProfile ||
  mongoose.model('PetProfile', petProfileSchema, 'petProfile');

export default PetProfile;