import React from 'react';
import {
  FormControl,
  FormHelperText,
  Select,
  MenuItem,
  InputLabel,
} from '@material-ui/core';

const SelectInput = ({
  name,
  label,
  handleChange,
  handleBlur,
  helperText,
  error,
  options,
  ...other
}) => {
  return (
    <FormControl variant="outlined" margin="dense" fullWidth>
      <InputLabel error={error} htmlFor={name}>
        {label}
      </InputLabel>
      <Select
        {...other}
        error={error}
        label={label}
        onChange={handleChange}
        onBlur={handleBlur}
        inputProps={{
          name: name,
          id: name,
        }}
      >
        {options.map((item, index) =>
          item.value === '' ? (
            <MenuItem key={index} value={item.value}>
              <em>None</em>
            </MenuItem>
          ) : (
            <MenuItem key={index} value={item.value} disabled={item.disabled}>
              {item.text}
            </MenuItem>
          )
        )}
      </Select>
      <FormHelperText error>{helperText}</FormHelperText>
    </FormControl>
  );
};

export default SelectInput;
