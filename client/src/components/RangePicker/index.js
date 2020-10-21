import { TextField } from "@material-ui/core";
import {
  DateRangeDelimiter,
  DateRangePicker as RangePicker,
} from "@material-ui/pickers";
import * as React from "react";
import rangePickerStyles from "./styles";

const RangePicker = ({
  fromLabel,
  toLabel,
  selectedDate,
  handleChange,
  handleApply,
}) => {
  const classes = rangePickerStyles();

  return (
    <RangePicker
      startText={fromLabel}
      endText={toLabel}
      value={selectedDate}
      onChange={(date) => handleChange(date)}
      inputFormat="dd/MM/yyyy"
      renderInput={(startProps, endProps) => (
        <>
          <TextField {...startProps} margin="dense" />
          <DateRangeDelimiter> to </DateRangeDelimiter>
          <TextField {...endProps} margin="dense" />
        </>
      )}
    />
  );
};

export default RangePicker;
