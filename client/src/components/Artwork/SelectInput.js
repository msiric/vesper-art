import React from 'react';
import { FormControl, Select, MenuItem, InputLabel } from '@material-ui/core';

const SelectInput = ({
  name,
  label,
  handleChange,
  handleBlur,
  options,
  ...other
}) => {
  return (
    <FormControl variant="outlined" margin="dense" fullWidth>
      <InputLabel htmlFor={name}>{label}</InputLabel>
      <Select
        {...other}
        label={label}
        onChange={handleChange}
        onBlur={handleBlur}
        inputProps={{
          name: name,
          id: name,
        }}
      >
        {options.map((item) =>
          item.value === '' ? (
            <MenuItem value={item.value}>
              <em>None</em>
            </MenuItem>
          ) : (
            <MenuItem value={item.value}>{item.text}</MenuItem>
          )
        )}
      </Select>
    </FormControl>
  );
};

export default SelectInput;
