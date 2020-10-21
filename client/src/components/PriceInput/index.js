import TextField from "@material-ui/core/TextField";
import React from "react";
import NumberFormat from "react-number-format";
import priceInputStyles from "./styles";

const FormattedNumber = ({ name, inputRef, onChange, ...other }) => {
  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        console.log(values, name);
        onChange({
          target: {
            name: name,
            value: values.value,
          },
        });
      }}
      thousandSeparator
      isNumericString
      prefix="$"
    />
  );
};

const PriceInput = ({ handleChange, handleBlur, ...other }) => {
  const classes = priceInputStyles();

  return (
    <div>
      <TextField
        {...other}
        onChange={handleChange}
        onBlur={handleBlur}
        InputProps={{
          inputComponent: FormattedNumber,
        }}
      />
    </div>
  );
};

export default PriceInput;
