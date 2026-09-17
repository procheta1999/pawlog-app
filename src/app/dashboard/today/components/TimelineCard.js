import RestaurantIcon from '@mui/icons-material/Restaurant';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import styles from './TimelineCard.module.css';
import DashboardButton from '../../components/DashboardButton';
import Timeline from '../../components/Timeline';

const timelineItems = [
  {
    time: '09:00',
    title: 'Breakfast',
    description: 'Ate normally',
    status: 'Confirmed',
    statusClass: 'confirmed',
    type: "meal",
    icon: RestaurantIcon,
  },
  {
    time: '11:30',
    title: 'Morning walk',
    description: 'About 30 minutes',
    status: 'Approximate',
    statusClass: 'approximate',
    type: "activity",
    icon: DirectionsWalkIcon,
  },
  {
    time: '14:00',
    title: 'Lunch',
    description: 'Needs confirmation',
    status: 'Needs review',
    statusClass: 'needsReview',
    type: "meal",
    icon: RestaurantIcon,
  },
  {
    time: '18:00',
    title: 'Dinner',
    description: 'Scheduled',
    status: 'Scheduled',
    statusClass: 'scheduled',
    type: "meal",
    icon: RestaurantIcon,
  },
];

export default function TimelineCard({ handleOpenCareModal }) {
  const handleOpenModal = () => {
    handleOpenCareModal(true);
  };

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

      <Timeline items={timelineItems} />
    </Card>
  );
}
