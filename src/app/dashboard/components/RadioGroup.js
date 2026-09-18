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

function getOptionValue(option) {
  return typeof option === 'string' ? option : option.value;
}

function getOptionLabel(option) {
  return typeof option === 'string' ? formatOptionLabel(option) : option.label;
}

export default function RadioGroup({
  id,
  label,
  value,
  onChange,
  options = [],
  disabled = false,
  ariaLabel,
  renderOptionLabel,
}) {
  const labelId = label ? `${id}-label` : undefined;
  const handleChange = (event) => {
    onChange(event.target.value);
  };

  return (
    <FormControl disabled={disabled}>
      {label && <FormLabel id={labelId}>{label}</FormLabel>}
      <MuiRadioGroup
        aria-labelledby={labelId}
        aria-label={ariaLabel}
        name={id}
        value={value}
        onChange={handleChange}
      >
        {options.map((option) => (
          <FormControlLabel
            key={getOptionValue(option)}
            value={getOptionValue(option)}
            control={<Radio />}
            label={renderOptionLabel ? renderOptionLabel(option) : getOptionLabel(option)}
          />
        ))}
      </MuiRadioGroup>
    </FormControl>
  );
}
