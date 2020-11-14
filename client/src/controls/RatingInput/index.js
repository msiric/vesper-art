import {
  FormControl,
  FormControlLabel,
  FormHelperText,
} from "@material-ui/core";
import { Rating } from "@material-ui/lab";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import ratingInputStyles from "./styles.js";

const Input = ({
  name,
  label,
  value,
  setValue,
  error,
  helperText,
  loading,
  other,
}) => {
  const classes = ratingInputStyles();

  return (
    <FormControl variant="outlined" margin="dense" fullWidth>
      <FormControlLabel
        control={
          <Rating
            {...other}
            value={value}
            onChange={(e, value) =>
              setValue(name, value || 0, { shouldValidate: true })
            }
            size="large"
          />
        }
        label={label}
      />
      {helperText && <FormHelperText error>{helperText}</FormHelperText>}
    </FormControl>
  );
};

const RatingInput = (props) => {
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

export default RatingInput;
