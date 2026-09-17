"use client";

import React from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

function formatOptionLabel(option) {
  return option
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

export default function Dropdown({
  id,
  label,
  value,
  onChange,
  options = [],
  disabled = false,
}) {
  const labelId = `${id}-label`;
  const handleChange = (event) => {
    onChange(event.target.value);
  };

  return (
    <FormControl fullWidth disabled={disabled}>
      <InputLabel id={labelId}>{label}</InputLabel>
      <Select
        id={id}
        labelId={labelId}
        value={value}
        label={label}
        onChange={handleChange}
      >
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            {formatOptionLabel(option)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
