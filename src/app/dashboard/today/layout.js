"use client";

import dayjs from 'dayjs';
import { Grid } from '@mui/material';
import { SubtitleHeader, TitleHeader } from '../components/ContentStyling';
import { useProfile } from '@/app/utils/ProfileContext';
import TodayDatePicker from './components/DatePicker';

export default function TodayLayout({ children }) {
  const { name, petParent } = useProfile();
  const petName = name || 'your pet';

  return (<>
    <Grid container spacing={3} sx={{ mt: 5 }}>
      <Grid size={{ xs: 12, md: 'auto' }}>
        <TitleHeader
          variant="h4"
          sx={{ typography: { xs: 'h5', md: 'h4' } }}
          content={`Good day, ${petParent}!`}
        />
        <SubtitleHeader
          variant="subtitle1"
          content={`Here's ${petName}'s care overview for today`}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 'auto' }} offset={{ md: 'auto' }}>
        <TodayDatePicker
          label="Today"
          value={dayjs()}
          onChange={() => { }}
          isEditable={false}
        />
      </Grid>
    </Grid>
    {children}
  </>
  );
}
