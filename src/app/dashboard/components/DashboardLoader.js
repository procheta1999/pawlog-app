import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import styles from './DashboardLoader.module.css';

export default function DashboardLoader() {
  return (
    <Box className={styles.loader}>
      <CircularProgress aria-label="Loading…" />
    </Box>
  );
}
