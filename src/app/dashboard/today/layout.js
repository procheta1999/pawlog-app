"use client";

import { SubtitleHeader, TitleHeader } from '../components/ContentStyling';
import { useProfile } from '@/app/utils/ProfileContext';

export default function TodayLayout({ children }) {
  const { name, petParent } = useProfile();
  const petName = name || 'your pet';

  return (
    <>
      <TitleHeader
        variant="h4"
        sx={{ typography: { xs: 'h5', md: 'h4' } }}
        content={`Good day, ${petParent}!`}
      />
      <SubtitleHeader
        variant="subtitle1"
        content={`Here's ${petName}'s care overview for today`}
      />
      {children}
    </>
  );
}
