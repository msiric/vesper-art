import { InputAdornment } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import Autocomplete from "../../domain/Autocomplete";
import FormControl from "../../domain/FormControl";
import FormHelperText from "../../domain/FormHelperText";
import TextField from "../../domain/TextField";

const Input = ({
  value,
  name,
  trigger,
  handleChange,
  helperText,
  error,
  limit,
  loading = false,
  adornment = null,
  ...props
}) => {
  const [state, setState] = useState({ tags: value, changed: false });

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
          setState({ tags: [...state.tags, e.target.value], changed: true });
        break;
      }
      default:
    }
  };

  const handleEdit = async () => {
    handleChange(null, state.tags);
    state.changed && (await trigger(name));
  };

  useEffect(() => {
    handleEdit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.tags, state.changed]);

  useEffect(() => {
    setState({ tags: value });
  }, [value]);

  return (
    <FormControl variant="outlined" fullWidth>
      <Autocomplete
        {...props}
        multiple
        freeSolo
        options={[]}
        value={state.tags}
        getOptionLabel={(option) => option.title || option}
        getOptionSelected={(value1, value2) => console.log(value1, value2)}
        onChange={(e, values) => setState({ tags: values, changed: true })}
        filterSelectedOptions
        loading={loading}
        renderInput={(params) => {
          params.inputProps.onKeyDown = handleKeyDown;
          return (
            <TextField
              inputProps={{
                ...params.inputProps,
                disabled: state.tags.length >= limit,
                startAdornment: adornment ? (
                  <InputAdornment position="start">{adornment}</InputAdornment>
                ) : null,
              }}
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
              error={error}
              fullWidth
            />
          );
        }}
      />
      <FormHelperText error>{helperText}</FormHelperText>
    </FormControl>
  );
};

const TagInput = (props) => {
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

export default TagInput;
