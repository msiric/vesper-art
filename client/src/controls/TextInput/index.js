import { ranges } from "@common/validation";
import Box from "@domain/Box";
import Typography from "@domain/Typography";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import InputAdornment from "../../domain/InputAdornment";
import TextField from "../../domain/TextField";
import textInputStyles from "./styles";

const HelperText = ({ helperText, value, maxCharacters }) => {
  const classes = textInputStyles();

  return (
    <Box className={classes.wrapper}>
      <Typography variant="caption">{helperText}</Typography>
      <Typography variant="caption" className={classes.maxCharacters}>
        {`${value.length}/${maxCharacters}`}
      </Typography>
    </Box>
  );
};

const Input = ({
  name,
  value,
  margin = "dense",
  variant = "outlined",
  loading = false,
  adornment = null,
  readOnly = false,
  showMaxChars = false,
  ...props
}) => {
  const maxCharacters = ranges[name]?.max ?? -1;

  return (
    <TextField
      {...props}
      InputProps={{
        startAdornment: adornment ? (
          <InputAdornment position="start">{adornment}</InputAdornment>
        ) : null,
        readOnly,
      }}
      inputProps={{
        ...(maxCharacters && { maxlength: maxCharacters }),
      }}
      maxRows={12}
      {...(showMaxChars && {
        helperText: (
          <HelperText
            helperText={props.helperText}
            value={value}
            maxCharacters={maxCharacters}
          />
        ),
      })}
      name={name}
      value={value}
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
