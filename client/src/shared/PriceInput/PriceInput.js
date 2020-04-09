import React from 'react';
import NumberFormat from 'react-number-format';
import TextField from '@material-ui/core/TextField';

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
