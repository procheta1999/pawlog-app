import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import MedicationIcon from '@mui/icons-material/Medication';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Step from '@mui/material/Step';
import StepConnector from '@mui/material/StepConnector';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import Typography from '@mui/material/Typography';
import styles from './TimelineCard.module.css';

const timelineItems = [
  {
    time: '09:00',
    title: 'Breakfast',
    description: 'Ate normally',
    status: 'Confirmed',
    statusClass: 'confirmed',
    icon: RestaurantIcon,
  },
  {
    time: '11:30',
    title: 'Morning walk',
    description: 'About 30 minutes',
    status: 'Approximate',
    statusClass: 'approximate',
    icon: DirectionsWalkIcon,
  },
  {
    time: '14:00',
    title: 'Medication',
    description: 'Heartworm tablet',
    extra: 'Needs confirmation',
    status: 'Needs review',
    statusClass: 'needsReview',
    icon: MedicationIcon,
  },
  {
    time: '18:00',
    title: 'Dinner',
    description: 'Scheduled',
    status: 'Scheduled',
    statusClass: 'scheduled',
    icon: RestaurantIcon,
  },
];

function TimelineStepIcon({ item }) {
  const EventIcon = item.icon;

  return (
    <Box component="span" className={styles.eventIcon}>
      <EventIcon />
    </Box>
  );
}

export default function TimelineCard() {
  return (
    <Card variant="outlined" className={styles.card} sx={{ p: { xs: 1, md: 2 } }}>
      <Box className={styles.header}>
        <Typography variant="h5" className={styles.title}>
          Today&apos;s Timeline
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          className={styles.recordButton}
        >
          Record care event
        </Button>
      </Box>

      <Stepper
        orientation="vertical"
        connector={<StepConnector className={styles.connector} />}
        className={styles.stepper}
      >
        {timelineItems.map((item) => (
          <Step key={`${item.time}-${item.title}`} active>
            <StepLabel
              slots={{
                stepIcon: () => <TimelineStepIcon item={item} />,
              }}
            >
              <Box component="span" className={styles.stepHeader}>
                <Typography component="span" className={styles.time}>{item.time}</Typography>
                <Box component="span" className={styles.eventDetails}>
                  <Typography component="span" className={styles.eventTitle}>{item.title}</Typography>
                  <Typography component="span" color="text.secondary">{item.description}</Typography>
                  {item.extra && (
                    <Typography component="span" color="text.secondary">{item.extra}</Typography>
                  )}
                </Box>
                <Chip
                  component="span"
                  label={item.status}
                  size="small"
                  className={`${styles.status} ${styles[item.statusClass]}`}
                />
                <IconButton aria-label={`More options for ${item.title}`}>
                  <MoreVertIcon />
                </IconButton>
              </Box>
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Card>
  );
}
