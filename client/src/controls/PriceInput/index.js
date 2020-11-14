import { TextField } from "@material-ui/core";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import NumberFormat from "react-number-format";

const Input = ({ name, setValue, trigger, ...other }) => {
  return (
    <NumberFormat
      {...other}
      customInput={TextField}
      onValueChange={async (values) => {
        setValue(name, values.floatValue);
        await trigger(name);
      }}
      thousandSeparator
      isNumericString
      prefix="$"
      variant="outlined"
      margin="dense"
      fullWidth
    />
  );
};

const PriceInput = (props) => {
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

export default PriceInput;
