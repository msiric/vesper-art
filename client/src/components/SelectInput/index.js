import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from "@material-ui/core";
import React from "react";
import selectInputStyles from "./styles";

const SelectInput = ({
  name,
  label,
  handleChange,
  options,
  handleBlur = null,
  helperText = null,
  error = null,
  ...other
}) => {
  const classes = selectInputStyles();

  return (
    <FormControl variant="outlined" margin="dense" fullWidth>
      <InputLabel error={error} htmlFor={name}>
        {label}
      </InputLabel>
      <Select
        {...other}
        error={error}
        label={label}
        onChange={handleChange}
        onBlur={handleBlur}
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
      {helperText && <FormHelperText error>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export default SelectInput;
