import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import FormControl from "../../domain/FormControl";
import FormControlLabel from "../../domain/FormControlLabel";
import FormHelperText from "../../domain/FormHelperText";
import Rating from "../../domain/Rating";
import ratingInputStyles from "./styles";

const Input = ({
  name,
  label,
  value,
  setValue,
  error,
  helperText,
  loading = false,
  ...props
}) => {
  const classes = ratingInputStyles();

  return (
    <FormControl variant="outlined" margin="dense" fullWidth>
      <FormControlLabel
        className={classes.wrapper}
        control={
          <Rating
            {...props}
            value={value}
            onChange={(e, value) => setValue(name, value || 0)}
            size="large"
            loading={loading}
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
