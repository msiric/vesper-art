import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import Autocomplete from "../../domain/Autocomplete";
import InputAdornment from "../../domain/InputAdornment";
import TextField from "../../domain/TextField";

const Input = ({
  value,
  name,
  label,
  setValue,
  helperText,
  error,
  options,
  loading = false,
  adornment = null,
  autoHighlight = true,
  autoSelect = true,
  ...props
}) => {
  return (
    <Autocomplete
      {...props}
      value={value ? options.find((item) => item.value === value) : ""}
      getOptionLabel={(option) => option.text}
      onChange={(e, item) => setValue(name, item ? item.value : "")}
      openOnFocus
      options={options}
      loading={loading}
      autoHighlight={autoHighlight}
      autoSelect={autoSelect}
      renderInput={(params) => (
        <TextField
          InputProps={{
            startAdornment: adornment ? (
              <InputAdornment position="start">{adornment}</InputAdornment>
            ) : null,
          }}
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
