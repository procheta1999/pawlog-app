"use client";
import React from 'react';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import styles from './DashboardButton.module.css';

export default function DashboardButton({
  children,
  variant = 'contained',
  startIcon = <AddIcon />,
  className = '',
  ...props
}) {
  return (
    <Button
      variant={variant}
      startIcon={startIcon}
      className={`${styles.button} ${className}`.trim()}
      sx={{ backgroundColor: "#208f68" }}
      {...props}
    >
      {children}
    </Button>
  );
}
