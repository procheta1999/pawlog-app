import { getProfile, updateProfile } from '../services/petProfileService';

function isValidProfile(profile) {
  if (!profile || typeof profile !== 'object') {
    return false;
  }

  return typeof profile.petName === 'string'
    && typeof profile.petBreed === 'string'
    && typeof profile.petWeight === 'string'
    && typeof profile.petAge === 'string'
    && typeof profile.petParent === 'string';
}

export async function getProfileController() {
  try {
    const data = await getProfile();
    return { data, status: 200 };
  } catch (error) {
    return {
      error: error.message || 'Failed to fetch profile',
      status: 500,
    };
  }
}

export async function updateProfileController(request) {
  try {
    const body = await request.json();

    if (!isValidProfile(body)) {
      return {
        error: 'profile must include petName, petBreed, petWeight, petAge and petParent as strings',
        status: 400,
      };
    }

    const data = await updateProfile(body);

    return {
      data,
      status: 200,
    };
  } catch (error) {
    return {
      error: error.message || 'Failed to update profile',
      status: 500,
    };
  }
}
