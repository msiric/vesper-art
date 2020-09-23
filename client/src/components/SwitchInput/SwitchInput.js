import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  Switch,
} from '@material-ui/core';
import React from 'react';

const SwitchInput = ({
  name,
  label,
  helperText = null,
  error = null,
  labelPlacement = 'start',
  ...other
}) => {
  return (
    <FormControl variant="outlined" margin="dense" fullWidth>
      <FormControlLabel
        control={
          <Switch
            {...other}
            edge="end"
            checked={other.value}
            inputProps={{
              name: name,
              id: name,
            }}
          />
        }
        label={label}
        labelPlacement={labelPlacement}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          margin: 0,
        }}
      />
      {helperText && <FormHelperText error>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export default SwitchInput;
