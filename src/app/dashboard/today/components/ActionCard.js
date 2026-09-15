import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import styles from './ActionCard.module.css';

export default function ActionCard({ card }) {
  return (
    <Card className={styles.card}>
      <CardActionArea className={`${styles.actionArea} ${styles[card.style]}`}>
        <CardContent className={styles.content}>
          <Typography variant="h4" className={styles.count}>
            {card.count}
          </Typography>
          <Typography className={styles.label}>
            {card.label}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
