"use client";

import React from 'react';
import { AppBar, IconButton, Toolbar, Typography } from "@mui/material";
import PetsIcon from '@mui/icons-material/Pets';
import styles from './AppHeader.module.css';

export const AppHeader=()=>{
  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{ backgroundColor: '#fff', color: '#000' }}
    >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            sx={[
              {
                marginRight: 1,
              },
            ]}
          >
           <PetsIcon fontSize="large" className={styles.petsIcon}/>
          </IconButton>
          <div>
          <Typography variant="h5" noWrap component="div" className={styles.title}>
            PawLog
          </Typography>
          <Typography variant="caption" noWrap component="div" className={styles.subtitle}>
            Systematic care logs for your pet
          </Typography>
          </div>
        </Toolbar>
    </AppBar>
  );
}