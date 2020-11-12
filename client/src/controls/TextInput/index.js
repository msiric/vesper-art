import { TextField } from "@material-ui/core";
import React from "react";
import textInputStyles from "./styles";

const TextInput = (props) => {
  const classes = textInputStyles();

  return (
    <TextField
      {...props}
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
