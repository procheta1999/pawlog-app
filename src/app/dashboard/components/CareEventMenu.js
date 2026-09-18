"use client";

import { useId, useState } from 'react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

export default function CareEventMenu({
  ariaLabel = 'More options',
  items = [],
  onAction = () => { },
}) {
  const id = useId();
  const buttonId = `${id}-button`;
  const menuId = `${id}-menu`;
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleMenuAction = (action) => {
    onAction?.(action);
    handleCloseMenu();
  };

  const handleMenuItemClick = (action) => () => {
    handleMenuAction(action);
  };

  return (
    <>
      <IconButton
        id={buttonId}
        aria-label={ariaLabel}
        aria-controls={openMenu ? menuId : undefined}
        aria-haspopup="true"
        aria-expanded={openMenu ? 'true' : undefined}
        size="small"
        onClick={handleOpenMenu}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id={menuId}
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleCloseMenu}
        slotProps={{
          list: {
            'aria-labelledby': buttonId,
          },
        }}
      >
        {items.map((item) => (
          <MenuItem
            key={item.value}
            disabled={item?.disabled || false}
            onClick={handleMenuItemClick(item.value)}
          >
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
