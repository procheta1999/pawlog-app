"use client";

import { createContext, useContext } from 'react';

const ProfileContext = createContext(null);


export function ProfileProvider({ children, profile }) {
  const { schema = [] } = profile || {};
  const getValue = (field) => schema.find((schemaItem) => schemaItem.field === field)?.value || '';
  const profileWithDetails = {
    schema,
    name: getValue('petName'),
    metadata: `${getValue('petBreed')} • ${getValue('petAge')} • ${getValue('petWeight')} kg`,
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
