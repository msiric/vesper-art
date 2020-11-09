import { TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import React, { useEffect, useState } from "react";
import tagInputStyles from "./styles";

const TagInput = ({
  value,
  name,
  label,
  handleChange,
  handleBlur,
  helperText,
  error,
  limit,
  ...other
}) => {
  const [state, setState] = useState({ tags: value });
  const classes = tagInputStyles();

  const handleKeyDown = (e) => {
    switch (e.key) {
      case "Enter":
      case ",":
      case " ": {
        e.preventDefault();
        e.stopPropagation();
        if (
          e.target.value.length &&
          state.tags.length < limit &&
          state.tags.indexOf(e.target.value) === -1
        )
          setState({ tags: [...state.tags, e.target.value] });
        break;
      }
      default:
    }
  };

  useEffect(() => {
    handleChange(null, state.tags);
  }, [state.tags]);

  return (
    <Autocomplete
      {...other}
      multiple
      freeSolo
      options={[]}
      value={state.tags}
      getOptionLabel={(option) => option.title || option}
      getOptionSelected={(value1, value2) => console.log(value1, value2)}
      onChange={(e, values) => setState({ tags: values })}
      filterSelectedOptions
      renderInput={(params) => {
        params.inputProps.onKeyDown = handleKeyDown;
        return (
          <TextField
            {...params}
            variant="outlined"
            label="Tags"
            placeholder={
              !state.tags.length
                ? ""
                : state.tags.length >= limit
                ? `You already selected ${limit} tags`
                : "Add a new tag"
            }
            margin="dense"
            inputProps={{
              ...params.inputProps,
              disabled: state.tags.length >= limit,
            }}
            fullWidth
          />
        );
      }}
    />
  );
};

export default TagInput;
