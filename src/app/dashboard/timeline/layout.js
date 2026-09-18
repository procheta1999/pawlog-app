import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import styles from './TimelineLayout.module.css';

export default function TimelineLayout({ children }) {
  return (
    <Box className={styles.page}>
      <Box className={styles.header}>
        <Box>
          <Typography variant="h4">Timeline</Typography>
          <Typography color="text.secondary">
            Review your pet&apos;s care history over time.
          </Typography>
        </Box>
      </Box>
      {children}
    </Box>
  );
}
