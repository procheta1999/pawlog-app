import RestaurantIcon from '@mui/icons-material/Restaurant';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import MedicationIcon from '@mui/icons-material/Medication';
import EventIcon from '@mui/icons-material/Event';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import styles from './TimelineCard.module.css';
import DashboardButton from '../../components/DashboardButton';
import Timeline from '../../components/Timeline';

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

function formatEventType(eventType) {
  return eventType.replaceAll('_', ' ').replace(/\b\w/g, (character) => character.toUpperCase());
}

function getTimelineItems(careEvents) {
  return careEvents.map((event) => {
    const status = statusDetails[event.status] || {
      label: formatEventType(event.status),
      className: 'needsReview',
    };

    return {
      ...event,
      sourceEvent: event,
      time: new Date(event.eventTime).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }),
      title: event.description || formatEventType(event.eventType),
      description: event.quantityDetails || event.notes || formatEventType(event.eventType),
      status: status.label,
      statusClass: status.className,
      icon: eventIcons[event.eventType] || EventIcon,
    };
  });
}

export default function TimelineCard({
  handleOpenCareModal,
  careEvents = [],
  onEventMenuAction=()=>{},
}) {
  const handleOpenModal = () => {
    handleOpenCareModal(true);
  };
  const timelineItems = getTimelineItems(careEvents);

  return (
    <Card variant="outlined" className={styles.card} sx={{ p: { xs: 1, md: 2 } }}>
      <Box className={styles.header}>
        <Typography variant="h5" className={styles.title}>
          Today&apos;s Timeline
        </Typography>
        <DashboardButton
          onClick={handleOpenModal}
        >
          Record care event
        </DashboardButton>
      </Box>

      <Timeline
        items={timelineItems}
        onEventMenuAction={onEventMenuAction}
        eventMenuItems={[{ label: 'Edit event', value: 'edit' }]}
      />
    </Card>
  );
}
