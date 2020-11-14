import { TextField } from "@material-ui/core";
import { Autocomplete as SearchableSelect } from "@material-ui/lab";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import autocompleteInputStyles from "./styles";

const Input = ({
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
      getOptionSelected={getOptionSelected}
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

const AutocompleteInput = (props) => {
  const { control } = useFormContext();
  const error = { invalid: false, message: "" };
  if (props.errors && props.errors.hasOwnProperty(props.name)) {
    error.invalid = true;
    error.message = props.errors[props.name].message;
  }

  return (
    <Controller
      as={Input}
      control={control}
      error={error.invalid}
      helperText={error.message}
      {...props}
    />
  );
};

export default AutocompleteInput;
