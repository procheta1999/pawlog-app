import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import DashboardLoader from '../../components/DashboardLoader';
import Timeline from '../../components/Timeline';
import styles from './TimelineEventsCard.module.css';

export default function TimelineEventsCard({ selectedDate, timelineItems, isLoading }) {
  return (
    <Card
      variant="outlined"
      className={styles.eventsCard}
      aria-busy={isLoading}
    >
      <Box sx={{ visibility: isLoading ? 'hidden' : 'visible' }}>
        <CardContent>
          <Typography variant="h6" className={styles.eventsTitle}>
            {selectedDate?.format('dddd, D MMMM YYYY') || 'Select a date'}
          </Typography>
          {timelineItems.length ? (
            <Timeline items={timelineItems} onEventMenuAction={null} />
          ) : (
            <Typography color="text.secondary" className={styles.emptyState}>
              No care events recorded for this date.
            </Typography>
          )}
        </CardContent>
      </Box>
      {isLoading && <DashboardLoader />}
    </Card>
  );
}
