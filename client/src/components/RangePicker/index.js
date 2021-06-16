import * as React from "react";
import RangeDelimiter from "../../domain/RangeDelimiter";
import RangePicker from "../../domain/RangePicker";
import TextField from "../../domain/TextField";
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
          <RangeDelimiter> to </RangeDelimiter>
          <TextField {...endProps} margin="dense" />
        </>
      )}
    />
  );
};

export default RangePicker;
