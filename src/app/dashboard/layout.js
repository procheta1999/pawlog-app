import Box from '@mui/material/Box';
import { AppHeader } from './components/AppHeader';
import DashboardTabs from './components/DashboardTabs';

export default function DashboardLayout({ children }) {
  return (
    <Box sx={{ width: '100%' }}>
      <AppHeader />
      <DashboardTabs />
      <Box sx={{ margin: { xs: '1rem', md: '2rem' } }}>{children}</Box>
    </Box>
  );
}
