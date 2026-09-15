import PetProfile from '../model/petProfileModel';
import connectDB from '../config/db';

function formatProfileData(profile) {
  const safeProfile = profile || {
    petName: '',
    petBreed: '',
    petWeight: '',
    petAge: '',
  };

  return [
    {
      field: 'petName',
      value: safeProfile.petName || '',
      type: 'input',
    },
    {
      field: 'petBreed',
      value: safeProfile.petBreed || '',
      type: 'input',
    },
    {
      field: 'petWeight',
      value: safeProfile.petWeight || '',
      type: 'input',
    },
    {
      field: 'petAge',
      value: safeProfile.petAge || '',
      type: 'input',
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
