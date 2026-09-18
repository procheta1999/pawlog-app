"use client";

import { createContext, useContext } from 'react';

const ProfileContext = createContext(null);


export function ProfileProvider({ children, profile, setProfile }) {
  const { schema = [], loading = true } = profile || {};
  const getFieldValue = (field) => schema.find((schemaItem) => schemaItem.field === field)?.value || '';
  const profileWithDetails = {
    schema,
    loading,
    setProfile,
    petParent: getFieldValue('petParent'),
    name: getFieldValue('petName'),
    metadata: `${getFieldValue('petBreed')} • ${getFieldValue('petAge')} • ${getFieldValue('petWeight')} kg`,
  };

  return (
    <ProfileContext.Provider value={profileWithDetails}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const profile = useContext(ProfileContext);

  if (!profile) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }

  return profile;
}
