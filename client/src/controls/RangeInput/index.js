import { TextField } from "@material-ui/core";
import {
  DateRangeDelimiter,
  DateRangePicker as RangePicker,
} from "@material-ui/pickers";
import * as React from "react";
import rangeInputStyles from "./styles.js";

// $TODO Treba sredit
const RangeInput = ({ fromLabel, toLabel, selectedDate, handleChange }) => {
  const classes = rangeInputStyles();

  return (
    <RangePicker
      startText={fromLabel}
      endText={toLabel}
      value={selectedDate}
      onChange={(date) => handleChange(date)}
      inputFormat="dd/MM/yyyy"
      renderInput={(startProps, endProps) => (
        <>
          <TextField
            {...startProps}
            margin="dense"
            className={classes.rangeInputField}
          />
          <DateRangeDelimiter> to </DateRangeDelimiter>
          <TextField
            {...endProps}
            margin="dense"
            className={classes.rangeInputField}
          />
        </>
      )}
    />
  );
};

export default RangeInput;
