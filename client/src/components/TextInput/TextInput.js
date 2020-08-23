import { TextField } from '@material-ui/core';
import { useField } from 'formik';
import React from 'react';

const TextInput = (props) => {
  const { errorText, ...other } = props;
  const [field, meta] = useField(props);

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
