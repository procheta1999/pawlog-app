"use client";

import Card from '@mui/material/Card';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import styles from './TimelineCalendar.module.css';

export default function TimelineCalendar({ value, onChange }) {
  return (
    <Card variant="outlined" className={styles.calendarCard}>
      {value && (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <StaticDatePicker
            value={value}
            onChange={onChange}
            slotProps={{ actionBar: { actions: [] } }}
          />
        </LocalizationProvider>
      )}
    </Card>
  );
}
