import { InputBase as BaseInput } from "@material-ui/core";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import inputBaseStyles from "./styles";

const Input = ({ name, value, setValue, ...other }) => {
  const classes = inputBaseStyles();

  console.log(value, setValue, name);

  return (
    <BaseInput
      {...other}
      classes={{
        root: classes.inputRoot,
        input: classes.inputInput,
      }}
      name={name}
      value={value}
      onChange={(e) => setValue(name, e.target.value)}
      inputProps={{ "aria-label": "search" }}
    />
  );
};

const InputBase = (props) => {
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

export default InputBase;
