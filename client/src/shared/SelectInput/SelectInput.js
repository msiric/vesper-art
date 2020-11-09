import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from "@material-ui/core";
import React from "react";

const SelectInput = ({
  name,
  label,
  onChange,
  onBlur,
  helperText,
  error,
  options,
  ...other
}) => {
  return (
    <FormControl variant="outlined" margin="dense" fullWidth>
      <InputLabel error={error} htmlFor={name}>
        {label}
      </InputLabel>
      <Select
        {...other}
        error={error}
        label={label}
        onChange={onChange}
        onBlur={onBlur}
        inputProps={{
          name: name,
          id: name,
        }}
      >
        {options.map((item, index) =>
          item.value === "" ? (
            <MenuItem key={index} value={item.value}>
              <em>None</em>
            </MenuItem>
          ) : (
            <MenuItem key={index} value={item.value} disabled={item.disabled}>
              {item.text}
            </MenuItem>
          )
        )}
      </Select>
      <FormHelperText error>{helperText}</FormHelperText>
    </FormControl>
  );
};

export default SelectInput;
