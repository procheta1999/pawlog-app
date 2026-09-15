"use client";

import { Geist, Geist_Mono } from 'next/font/google';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';
import { useEffect, useState } from 'react';
import { ProfileProvider } from './utils/ProfileContext';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const appInfo = {
  title: 'PawLogs',
  description: 'Systematic care logs for your pet',
};

export default function RootLayout({ children }) {
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
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body style={{ margin: '1rem' }}>
        <AppRouterCacheProvider>
          <ProfileProvider profile={profileData} setProfile={setProfileData}>{children}</ProfileProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
