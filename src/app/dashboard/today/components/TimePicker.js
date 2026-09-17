"use client";

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

export default function TodayTimePicker({
  value,
  onChange,
  label = 'Select time',
  disabled = false,
  isEditable = false,
}) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <TimePicker
        label={label}
        value={value}
        onChange={onChange}
        disabled={disabled}
        readOnly={!isEditable}
      />
    </LocalizationProvider>
  );
}
