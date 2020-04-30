import React, { useState } from 'react';
import {
  FormControl,
  FormHelperText,
  Input,
  InputLabel,
} from '@material-ui/core';
import StripeInput from './StripeInput';

const StripeElementWrapper = ({ component, label }) => {
  const [state, setState] = useState({
    focused: false,
    empty: true,
    error: false,
  });

  const handleBlur = () => {
    setState((prevState) => ({ ...prevState, focused: false }));
  };

  const handleFocus = () => {
    setState((prevState) => ({ ...prevState, focused: true }));
  };

  const handleChange = (changeObj) => {
    setState((prevState) => ({
      ...prevState,
      error: changeObj.error,
      empty: changeObj.empty,
    }));
  };

  return (
    <div>
      <FormControl fullWidth margin="normal">
        <InputLabel
          focused={state.focused}
          shrink={state.focused || !state.empty}
          error={!!state.error}
        >
          {label}
        </InputLabel>
        <Input
          fullWidth
          inputComponent={StripeInput}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          inputProps={{ component }}
        />
        {state.error && (
          <FormHelperText error={state.error}>
            {state.error.message}
          </FormHelperText>
        )}
      </FormControl>
    </div>
  );
};

export default StripeElementWrapper;
