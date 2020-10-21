import { TextField } from "@material-ui/core";
import { Autocomplete as SearchableSelect } from "@material-ui/lab";
import React from "react";
import autocompleteInputStyles from "./styles";

const AutocompleteInput = ({
  label,
  handleChange,
  handleBlur,
  getOptionSelected,
  getOptionLabel,
  helperText,
  error,
  options,
  ...other
}) => {
  const classes = autocompleteInputStyles();

  return (
    <SearchableSelect
      {...other}
      getOptionLabel={getOptionLabel}
      onBlur={handleBlur}
      onChange={handleChange}
      openOnFocus
      options={options}
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

export default AutocompleteInput;
