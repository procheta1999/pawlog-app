"use client";

import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import EventIcon from '@mui/icons-material/Event';
import MedicationIcon from '@mui/icons-material/Medication';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import Grid from '@mui/material/Grid';
import TimelineCalendar from './components/TimelineCalendar';
import TimelineEventsCard from './components/TimelineEventsCard';
import { getCareEventTimelineItems } from '@/app/utils/eventUtils';

const eventIcons = {
  meal: RestaurantIcon,
  walk: DirectionsWalkIcon,
  medication: MedicationIcon,
};

const statusDetails = {
  confirmed: { label: 'Confirmed', className: 'confirmed' },
  partial: { label: 'Approximate', className: 'approximate' },
  in_review: { label: 'In Review', className: 'needsReview' },
  scheduled: { label: 'Scheduled', className: 'scheduled' },
};

const getCareEventsForDate = async (selectedDate) => {
  const response = await fetch(
    `/api/care-events/by-date?date=${selectedDate.format('YYYY-MM-DD')}`,
    { cache: 'no-store' },
  );

  if (!response.ok) {
    throw new Error('Failed to fetch care events');
  }

  return response.json();
};

export default function TimelinePage() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [careEvents, setCareEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleDateChange = (newDate) => {
    if (newDate?.isValid()) {
      setSelectedDate(newDate);
    }
  };

  useEffect(() => {
    const initializeDate = window.setTimeout(() => {
      setSelectedDate(dayjs());
    }, 0);

    return () => window.clearTimeout(initializeDate);
  }, []);

  useEffect(() => {
    if (!selectedDate) {
      return;
    }

    const loadCareEventsForDate = async () => {
      setLoading(true);

      try {
        setCareEvents(await getCareEventsForDate(selectedDate));
      } catch {
        setCareEvents([]);
      } finally {
        setLoading(false);
      }
    };

    loadCareEventsForDate();
  }, [selectedDate]);

  const timelineItems = getCareEventTimelineItems(
    careEvents,
    statusDetails,
    eventIcons,
    EventIcon,
  );
  const isEventsLoading = !selectedDate || loading;

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 4 }}>
        <TimelineCalendar
          value={selectedDate}
          onChange={handleDateChange}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 8 }}>
        <TimelineEventsCard
          selectedDate={selectedDate}
          timelineItems={timelineItems}
          isLoading={isEventsLoading}
        />
      </Grid>
    </Grid>
  );
}
