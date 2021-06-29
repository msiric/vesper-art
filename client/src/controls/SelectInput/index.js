import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import InputAdornment from "../../domain/InputAdornment";
import MenuItem from "../../domain/MenuItem";
import TextField from "../../domain/TextField";

const Input = ({
  label,
  options,
  variant = "outlined",
  loading = false,
  margin = "dense",
  adornment = null,
  ...props
}) => {
  return (
    <TextField
      InputProps={{
        startAdornment: adornment ? (
          <InputAdornment position="start">{adornment}</InputAdornment>
        ) : null,
      }}
      {...props}
      variant={variant}
      margin={margin}
      label={label}
      loading={loading}
      select
      fullWidth
    >
      {options.map((item, index) =>
        item.value === "" ? (
          <MenuItem key={index} value={item.value}>
            <em>None</em>
          </MenuItem>
        ) : (
          <MenuItem key={index} value={item.value} disabled={item.disabled}>
            {item.text}
          </MenuItem>
        )
      )}
    </TextField>
  );
};

const SelectInput = (props) => {
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

export default SelectInput;
