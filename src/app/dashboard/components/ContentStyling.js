import { Typography } from '@mui/material';
import styles from './ContentStyling.module.css';

export const TitleHeader=({ variant, className = styles.title, content, sx={} })=> {
  return (
    <Typography variant={variant} noWrap component="div" className={className} sx={sx}>
      {content}
    </Typography>
  );
}

export const SubtitleHeader=({ variant = 'caption', className = styles.subtitle, content })=> {
  return (
    <Typography variant={variant} noWrap component="div" className={className}>
      {content}
    </Typography>
  );
}
