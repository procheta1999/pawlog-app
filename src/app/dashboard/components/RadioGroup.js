"use client";

import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import MuiRadioGroup from '@mui/material/RadioGroup';

function formatOptionLabel(option) {
  return option
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

export default function RadioGroup({
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
    <FormControl disabled={disabled}>
      <FormLabel id={labelId}>{label}</FormLabel>
      <MuiRadioGroup
        aria-labelledby={labelId}
        name={id}
        value={value}
        onChange={handleChange}
      >
        {options.map((option) => (
          <FormControlLabel
            key={option}
            value={option}
            control={<Radio />}
            label={formatOptionLabel(option)}
          />
        ))}
      </MuiRadioGroup>
    </FormControl>
  );
}
