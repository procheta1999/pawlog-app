"use client";

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import styles from './ProfileCard.module.css';
import actionStyles from './ActionCard.module.css';
import { TitleHeader } from '../../components/ContentStyling';
import { CardHeader, CircularProgress, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ActionCard from './ActionCard';

const stats = [
  {
    count: 3,
    label: 'Recorded',
    style: 'recorded',
  },
  {
    count: 1,
    label: 'Scheduled',
    style: 'scheduled',
  },
  {
    count: 1,
    label: 'Needs review',
    style: 'needsReview',
  },
];

const ProfileCardHeader=({openEditModalOp, nameOfPet, metadataOfPet})=>{

    return(
        <CardHeader
        avatar={
          <Avatar
            src="/juno.jpg"
            alt="Juno the indie"
            sx={{
              width: { xs: 96, sm: 128 },
              height: { xs: 96, sm: 128 },
              '& img': {
                objectFit: 'cover',
                objectPosition: 'center',
              },
            }}
          />
        }
        action={
          <IconButton aria-label="edit profile" onClick={openEditModalOp}>
            <EditIcon/>
          </IconButton>
        }
        title={<TitleHeader variant="h5" className={styles.name} content={nameOfPet}/>} 
        subheader={<Typography color="text.secondary" className={styles.metadata}>
                  {metadataOfPet}
                </Typography>}
      />
    )
}
export default function ProfileCard({handleOpenEditModal, nameOfPet, metadataOfPet, dataLoadingState}) {
    const openEditModalOp=()=>{
        handleOpenEditModal(true);
    }
  return (
    <Card
      variant="outlined"
      className={styles.card}
      aria-busy={dataLoadingState}
      sx={{ position: 'relative' }}
    >
      <Box sx={{ visibility: dataLoadingState ? 'hidden' : 'visible' }}>
        <ProfileCardHeader openEditModalOp={openEditModalOp} nameOfPet={nameOfPet} metadataOfPet={metadataOfPet}/>
        <CardContent>
          <Box className={actionStyles.cards}>
            {stats.map((stat) => (
              <ActionCard key={stat.label} card={stat} />
            ))}
          </Box>
        </CardContent>
      </Box>
      {dataLoadingState && (
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CircularProgress aria-label="Loading…" />
        </Box>
      )}
    </Card>
  );
}
