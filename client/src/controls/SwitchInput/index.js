import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  Switch,
} from "@material-ui/core";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import switchInputStyles from "./styles";

const Input = ({
  value,
  name,
  label,
  setValue,
  helperText = null,
  error = null,
  labelPlacement = "start",
  ...other
}) => {
  const classes = switchInputStyles();

  return (
    <FormControl variant="outlined" margin="dense" fullWidth>
      <FormControlLabel
        control={
          <Switch
            edge="end"
            checked={value}
            onChange={(e, value) => setValue(name, value)}
            inputProps={{
              name: name,
              id: name,
            }}
            color="primary"
          />
        }
        label={label}
        labelPlacement={labelPlacement}
        style={{
          display: "flex",
          justifyContent: "space-between",
          margin: 0,
        }}
      />
      {helperText && <FormHelperText error>{helperText}</FormHelperText>}
    </FormControl>
  );
};

const SwitchInput = (props) => {
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

export default SwitchInput;
