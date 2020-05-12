import * as React from 'react';
import { TextField } from '@material-ui/core';
import {
  DateRangePicker as RangePicker,
  DateRangeDelimiter,
} from '@material-ui/pickers';

const DateRangePicker = ({
  fromLabel,
  toLabel,
  selectedDate,
  handleChange,
  handleApply,
}) => {
  return (
    <RangePicker
      startText={fromLabel}
      endText={toLabel}
      value={selectedDate}
      onChange={(date) => handleChange(date)}
      onAccept={handleApply}
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

export default DateRangePicker;
