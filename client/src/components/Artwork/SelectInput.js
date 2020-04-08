import React from 'react';
import { FormControl, Select, InputLabel } from '@material-ui/core';

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
            <option aria-label="None" value={item.value} />
          ) : (
            <option value={item.value}>{item.text}</option>
          )
        )}
      </Select>
    </FormControl>
  );
};

export default SelectInput;
