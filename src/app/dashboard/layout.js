"use client";

import Box from '@mui/material/Box';
import { useEffect, useState } from 'react';
import { AppHeader } from './components/AppHeader';
import DashboardTabs from './components/DashboardTabs';
import { ProfileProvider } from '../utils/ProfileContext';

export default function DashboardLayout({ children }) {
  const [profileData, setProfileData] = useState({
    schema: [],
    loading: true,
  });

  async function getProfileData() {
    const response = await fetch('/api/profile', {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }

    return response.json();
  }

  useEffect(() => {
    getProfileData()
      .then((data) => setProfileData({ ...data, loading: false }))
      .catch(() => setProfileData({ schema: [], loading: false }));
  }, []);

  return (
    <ProfileProvider profile={profileData} setProfile={setProfileData}>
      <Box sx={{ width: '100%' }}>
        <AppHeader title="PawLog" subtitle="Systematic care logs for your pet" />
        <DashboardTabs />
        <Box sx={{ margin: { xs: '1rem', md: '2rem' } }}>{children}</Box>
      </Box>
    </ProfileProvider>
  );
}
