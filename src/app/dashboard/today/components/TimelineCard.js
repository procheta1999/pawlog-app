import RestaurantIcon from '@mui/icons-material/Restaurant';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import MedicationIcon from '@mui/icons-material/Medication';
import EventIcon from '@mui/icons-material/Event';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import styles from './TimelineCard.module.css';
import DashboardButton from '../../components/DashboardButton';
import DashboardLoader from '../../components/DashboardLoader';
import Timeline from '../../components/Timeline';
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

export default function TimelineCard({
  handleOpenCareModal,
  careEvents = [],
  dataLoadingState = false,
  isCareScheduleEmpty = false,
  onEventMenuAction = () => { },
}) {
  const handleOpenModal = () => {
    handleOpenCareModal(true);
  };
  const timelineItems = getCareEventTimelineItems(
    careEvents,
    statusDetails,
    eventIcons,
    EventIcon,
  );

  return (
    <Card
      variant="outlined"
      className={styles.card}
      aria-busy={dataLoadingState}
      sx={{ p: { xs: 1, md: 2 }, position: 'relative' }}
    >
      <Box sx={{ visibility: dataLoadingState ? 'hidden' : 'visible' }}>
        <Box className={styles.header}>
          <Typography variant="h5" className={styles.title}>
            Today&apos;s Timeline
          </Typography>
          <DashboardButton
            onClick={handleOpenModal}
            disabled={isCareScheduleEmpty}
          >
            Record care event
          </DashboardButton>
        </Box>

        <Timeline
          items={timelineItems}
          onEventMenuAction={onEventMenuAction}
          eventMenuItems={[{ label: 'Edit event', value: 'edit' }]}
        />
      </Box>
      {dataLoadingState && <DashboardLoader />}
    </Card>
  );
}
