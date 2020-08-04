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

const PriceInput = ({ onChange, onBlur, ...other }) => {
  return (
    <div>
      <TextField
        {...other}
        onChange={onChange}
        onBlur={onBlur}
        InputProps={{
          inputComponent: FormattedNumber,
        }}
      />
    </div>
  );
};

export default PriceInput;
