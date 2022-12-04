import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import Autocomplete from "../../domain/Autocomplete";
import Chip from "../../domain/Chip";
import CircularProgress from "../../domain/CircularProgress";
import TextField from "../../domain/TextField";
import multiChipInputStyles from "./styles";

const Input = ({
  input,
  value,
  name,
  label,
  setValue,
  getOptionLabel,
  helperText,
  error,
  options,
  variant = "text",
  loading = false,
  fetching = false,
  adornment = null,
  autoHighlight = true,
  autoSelect = true,
  setInput = () => null,
  ...props
}) => {
  const classes = multiChipInputStyles();

  return (
    <Autocomplete
      {...props}
      value={value}
      inputValue={input}
      onInputChange={(e, val) => setInput(val)}
      onChange={(e, items) => setValue(name, items)}
      defaultValue={[]}
      multiple
      freeSolo
      openOnFocus
      options={options}
      loading={loading}
      autoHighlight={autoHighlight}
      autoSelect={autoSelect}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <Chip
            key={option}
            variant="outlined"
            label={option}
            {...getTagProps({ index })}
          />
        ))
      }
      renderInput={(params) => (
        <TextField
          {...params}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {fetching ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
          label={label}
          helperText={helperText}
          error={error}
          margin="dense"
          variant="outlined"
          fullWidth
        />
      )}
    />
  );
};

const MultiChipInput = (props) => {
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

export default MultiChipInput;
