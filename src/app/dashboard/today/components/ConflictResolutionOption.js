import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function ConflictResolutionOption({ label, description }) {
  return (
    <Box>
      <Typography fontWeight={700}>{label}</Typography>
      <Typography color="text.secondary" variant="body2">
        {description}
      </Typography>
    </Box>
  );
}
