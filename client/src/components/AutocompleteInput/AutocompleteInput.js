import { TextField } from '@material-ui/core';
import { Autocomplete as SearchableSelect } from '@material-ui/lab';
import React from 'react';

const Autocomplete = ({
  label,
  handleChange,
  handleBlur,
  getOptionLabel,
  helperText,
  error,
  options,
  ...other
}) => {
  return (
    <SearchableSelect
      {...other}
      getOptionLabel={getOptionLabel}
      onBlur={handleBlur}
      onChange={handleChange}
      openOnFocus
      options={options}
      getOptionSelected={(item, current) => item.value == current}
      renderInput={(other) => (
        <TextField
          {...other}
          label={label}
          helperText={helperText}
          error={error}
          margin="dense"
          variant="outlined"
          fullWidth
        />
      )}
    />
  );
};

export default Autocomplete;
