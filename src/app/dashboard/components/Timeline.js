import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Step from '@mui/material/Step';
import StepContent from '@mui/material/StepContent';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import Typography from '@mui/material/Typography';
import styles from "./Timeline.module.css";
import CareEventMenu from './CareEventMenu';

const statusChipColors = {
  confirmed: { bgcolor: '#eaf8f1', color: '#208451' },
  approximate: { bgcolor: '#fff1d6', color: '#a85c17' },
  needsReview: { bgcolor: '#ffe7e7', color: '#d33d3d' },
  scheduled: { bgcolor: '#e7f0ff', color: '#2868c7' },
};

function TimelineStepIcon({ item }) {
  const EventIcon = item.icon;

  return (
    <Box component="span" className={styles.eventIcon}>
      <EventIcon />
    </Box>
  );
}

export default function Timeline({
  items = [],
  onEventMenuAction = () => { },
  eventMenuItems = [
    { label: 'Edit event', value: 'edit' },
    { label: 'Delete event', value: 'delete' },
  ],
}) {
  const handleMenuAction = (item) => (action) => {
    onEventMenuAction(item.sourceEvent || item, action);
  };

  return (
    <Stepper
      orientation="vertical"
    >
      {items.map((item) => (
        <Step key={item.id || `${item.time}-${item.title}`} active>
          <StepLabel
            slots={{
              stepIcon: () => <TimelineStepIcon item={item} />,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
              <Typography component="span"
              >{item.time}</Typography>
              <Typography component="span"
              >{item.title}</Typography>
            </Box>
          </StepLabel>
          <StepContent>
            <Box className={styles.eventContent}>
              <Typography sx={{ ml: 2, minWidth: 0 }}>{item.description}</Typography>
              <Box className={styles.eventActions}>
                <Chip
                  component="span"
                  label={item.status}
                  size="small"
                  className={`${styles.status} ${styles[item.statusClass]}`}
                  sx={statusChipColors[item.statusClass]}
                />
                {onEventMenuAction && (
                  <CareEventMenu
                    ariaLabel={`More options for ${item.title}`}
                    items={eventMenuItems}
                    onAction={handleMenuAction(item)}
                  />
                )}
              </Box>
            </Box>
          </StepContent>
        </Step>
      ))}
    </Stepper>
  );
}
