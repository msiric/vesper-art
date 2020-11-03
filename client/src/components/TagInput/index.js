import { TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import React, { useState } from "react";
import tagInputStyles from "./styles";

const TagInput = () => {
  const [value, setValue] = useState([]);

  const classes = tagInputStyles();

  const handleKeyDown = (e) => {
    switch (e.key) {
      case ",":
      case " ": {
        e.preventDefault();
        e.stopPropagation();
        if (e.target.value.length > 0) setValue([...value, e.target.value]);
        break;
      }
      default:
    }
  };

  return (
    <Autocomplete
      multiple
      freeSolo
      options={[]}
      getOptionLabel={(option) => option.title || option}
      value={value}
      onChange={(e, newValue) => setValue(newValue)}
      filterSelectedOptions
      renderInput={(params) => {
        params.inputProps.onKeyDown = handleKeyDown;
        return (
          <TextField
            {...params}
            variant="outlined"
            label="filterSelectedOptions"
            placeholder="Tags"
            margin="normal"
            fullWidth
          />
        );
      }}
    />
  );
};

export default TagInput;
