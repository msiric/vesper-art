import * as React from "react";
import RangeDelimiter from "../../domain/RangeDelimiter";
import RangePicker from "../../domain/RangePicker";
import TextField from "../../domain/TextField";
import rangeInputStyles from "./styles";

// $TODO Treba sredit
const RangeInput = ({
  fromLabel,
  toLabel,
  selectedDate,
  handleChange,
  loading = false,
}) => {
  const classes = rangeInputStyles();

  return (
    <RangePicker
      startText={fromLabel}
      endText={toLabel}
      value={selectedDate}
      onChange={(date) => handleChange(date)}
      inputFormat="dd/MM/yyyy"
      loading={loading}
      renderInput={(startProps, endProps) => (
        <>
          <TextField {...startProps} margin="dense" className={classes.input} />
          <RangeDelimiter> to </RangeDelimiter>
          <TextField {...endProps} margin="dense" className={classes.input} />
        </>
      )}
    />
  );
};

export default RangeInput;
