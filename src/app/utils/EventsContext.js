"use client";

import { createContext, useContext } from 'react';

const EventsContext = createContext(null);
const defaultCareEventsCount = { recorded: 0, scheduled: 0, inReview: 0 };

const getCareEventStats = (careEventsCount = defaultCareEventsCount) => {
  return ([
    {
      count: careEventsCount.recorded || 0,
      label: 'Recorded',
      style: 'recorded',
    },
    {
      count: careEventsCount.scheduled || 0,
      label: 'Scheduled',
      style: 'scheduled',
    },
    {
      count: careEventsCount.inReview || 0,
      label: 'Needs review',
      style: 'needsReview',
    },
  ]);
}
export function EventsProvider({ children, eventsCount, setEventsCount }) {
  const CareEvents = {
    careEventsStats: getCareEventStats(eventsCount),
    setEventsCount
  };

  return (
    <EventsContext.Provider value={CareEvents}>
      {children}
    </EventsContext.Provider>
  );
}

export function useCareEvents() {
  const events = useContext(EventsContext);

  if (!events) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }

  return events;
}
