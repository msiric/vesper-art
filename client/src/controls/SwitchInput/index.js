import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import FormControl from "../../domain/FormControl";
import FormControlLabel from "../../domain/FormControlLabel";
import FormHelperText from "../../domain/FormHelperText";
import Switch from "../../domain/Switch";
import switchInputStyles from "./styles";

const Input = ({
  value,
  name,
  label,
  setValue,
  helperText = null,
  error = null,
  labelPlacement = "start",
  loading = false,
  ...props
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
            loading={loading}
          />
        }
        label={label}
        labelPlacement={labelPlacement}
        className={classes.wrapper}
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
