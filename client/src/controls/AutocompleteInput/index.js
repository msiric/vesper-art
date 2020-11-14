import { TextField } from "@material-ui/core";
import { Autocomplete as SearchableSelect } from "@material-ui/lab";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import autocompleteInputStyles from "./styles";

const Input = ({
  value,
  name,
  label,
  setValue,
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
      value={value ? options.find((item) => item.value === value) : ""}
      getOptionLabel={(option) => option.text}
      onChange={(e, item) => setValue(name, item ? item.value : "")}
      openOnFocus
      options={options}
      renderInput={(params) => (
        <TextField
          {...params}
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
