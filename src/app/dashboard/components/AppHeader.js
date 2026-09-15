"use client";

import React from 'react';
import { AppBar, IconButton, Toolbar } from "@mui/material";
import PetsIcon from '@mui/icons-material/Pets';
import styles from './AppHeader.module.css';
import { SubtitleHeader, TitleHeader } from './ContentStyling';

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
          <TitleHeader variant="h5" content="PawLog" />
          <SubtitleHeader content="Systematic care logs for your pet" />
          </div>
        </Toolbar>
    </AppBar>
  );
}