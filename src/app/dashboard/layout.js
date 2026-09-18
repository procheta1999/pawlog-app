"use client";

import Box from '@mui/material/Box';
import React, { useEffect, useState } from 'react';
import { AppHeader } from './components/AppHeader';
import DashboardTabs from './components/DashboardTabs';
import { ProfileProvider } from '../utils/ProfileContext';
import { EventsProvider } from '../utils/EventsContext';

export default function DashboardLayout({ children }) {
  const [profileData, setProfileData] = useState({
    schema: [],
    loading: true,
  });
  const [todayCareEventsCounts, setTodayCareEventsCounts] = useState({ recorded: 0, scheduled: 0, inReview: 0 })

  async function getProfileData() {
    const response = await fetch('/api/profile', {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }

    return response.json();
  }

  async function getTodayCareEventsStatusCounts() {
    const response = await fetch('/api/care-events/status-counts', {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch status counts');
    }

    return response.json();
  }

  useEffect(() => {
    getProfileData()
      .then((data) => setProfileData({ ...data, loading: false }))
      .catch(() => setProfileData({ schema: [], loading: false }));
    getTodayCareEventsStatusCounts()
      .then((data) => setTodayCareEventsCounts(data))
      .catch(() => setTodayCareEventsCounts({ recorded: 0, scheduled: 0, inReview: 0 }));
  }, []);

  return (
    <ProfileProvider profile={profileData} setProfile={setProfileData}>
      <EventsProvider eventsCount={todayCareEventsCounts} setEventsCount={setTodayCareEventsCounts}>
        <Box sx={{ width: '100%' }}>
          <AppHeader title="PawLog" subtitle="Systematic care logs for your pet" />
          <DashboardTabs />
          <Box sx={{ margin: { xs: '1rem', md: '2rem' } }}>{children}</Box>
        </Box>
      </EventsProvider>
    </ProfileProvider>
  );
}
