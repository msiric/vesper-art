import { TextField } from "@material-ui/core";
import { useField } from "formik";
import React from "react";
import textInputStyles from "./styles";

const TextInput = (props) => {
  const { errorText, ...other } = props;
  const [field, meta] = useField(props);

  const classes = textInputStyles();

  return (
    <TextField
      {...field}
      {...other}
      type="text"
      error={meta.touched && meta.error}
      helperText={meta.touched && meta.error}
      margin="dense"
      variant="outlined"
      fullWidth
    />
  );
};

export default TextInput;
