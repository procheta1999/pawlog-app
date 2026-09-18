import PetProfile from '../model/petProfileModel';
import connectDB from '../config/db';

export async function getCurrentPetId(
  errorMessage = 'A pet profile is required before continuing',
) {
  const profile = await PetProfile.findOne().select('_id').lean();

  if (!profile) {
    const error = new Error(errorMessage);
    error.status = 404;
    throw error;
  }

  return profile._id;
}

function formatProfileData(profile) {
  const profileDetails = profile || {
    petParent: '',
    petName: '',
    petBreed: '',
    petWeight: '',
    petAge: '',
  };

  return [
    {
      field: 'petParent',
      value: profileDetails.petParent || '',
      type: 'input',
      disabled: true,
      required: true,
    },
    {
      field: 'petName',
      value: profileDetails.petName || '',
      type: 'input',
      disabled: false,
      required: true,
    },
    {
      field: 'petBreed',
      value: profileDetails.petBreed || '',
      type: 'input',
      disabled: false,
      required: true,
    },
    {
      field: 'petWeight',
      value: profileDetails.petWeight || '',
      type: 'input',
      disabled: false,
      required: true,
    },
    {
      field: 'petAge',
      value: profileDetails.petAge || '',
      type: 'input',
      disabled: false,
      required: true,
    },
  ];
}

export async function getProfile() {
  await connectDB();

  const profile = await PetProfile.findOne().lean();

  return {
    schema: formatProfileData(profile),
  };
}

export async function updateProfile(profileData) {
  await connectDB();

  const updated = await PetProfile.findOneAndUpdate(
    {},
    {
      petName: profileData.petName || '',
      petBreed: profileData.petBreed || '',
      petWeight: profileData.petWeight || '',
      petAge: profileData.petAge || '',
      petParent: profileData.petParent || ''
    },
    {
      upsert: true,
      new: true,
      runValidators: true,
    },
  ).lean();

  return {
    schema: formatProfileData(updated),
  };
}
