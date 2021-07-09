import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import CurrencyValue from "../../components/CurrencyValue";
import TextField from "../../domain/TextField";

const Input = ({ name, setValue, trigger, loading = false, ...props }) => {
  return (
    <CurrencyValue
      {...props}
      customInput={TextField}
      onValueChange={async (values) => {
        setValue(name, values.floatValue);
        await trigger(name);
      }}
      decimalScale={2}
      displayType="input"
      thousandSeparator
      isNumericString
      variant="outlined"
      margin="dense"
      loading={loading}
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
