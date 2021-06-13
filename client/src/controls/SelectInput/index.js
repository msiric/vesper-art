import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import FormControl from "../../domain/FormControl";
import FormHelperText from "../../domain/FormHelperText";
import InputLabel from "../../domain/InputLabel";
import MenuItem from "../../domain/MenuItem";
import Select from "../../domain/Select";

const Input = ({
  name,
  label,
  options,
  helperText,
  error,
  loading = false,
  ...props
}) => {
  return (
    <FormControl variant="outlined" margin="dense" fullWidth>
      <InputLabel error={error} htmlFor={name} loading={loading}>
        {label}
      </InputLabel>
      <Select
        {...props}
        error={error}
        label={label}
        loading={loading}
        inputProps={{
          name: name,
          id: name,
        }}
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
      </Select>
      {helperText && <FormHelperText error>{helperText}</FormHelperText>}
    </FormControl>
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
