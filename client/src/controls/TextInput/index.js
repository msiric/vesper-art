import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import InputAdornment from "../../domain/InputAdornment";
import TextField from "../../domain/TextField";

const Input = ({
  margin = "dense",
  variant = "outlined",
  loading = false,
  adornment = null,
  readOnly = false,
  ...props
}) => {
  return (
    <TextField
      InputProps={{
        startAdornment: adornment ? (
          <InputAdornment position="start">{adornment}</InputAdornment>
        ) : null,
        readOnly,
      }}
      {...props}
      margin={margin}
      variant={variant}
      loading={loading}
      fullWidth
    />
  );
};

const TextInput = (props) => {
  const { control } = useFormContext();
  const error = { invalid: false, message: "" };
  if (props.errors && props.errors.hasOwnProperty(props.name)) {
    error.invalid = true;
    error.message = props.errors[props.name].message;
  }

  console.log("props", props);

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

export default TextInput;
