import React, { useContext, useState, useEffect } from 'react';
import { Context } from '../../context/Store.js';
import {
  Container,
  Grid,
  CircularProgress,
  Paper,
  Divider,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from '@material-ui/core';
import DateRangePicker from '../../shared/DateRangePicker/DateRangePicker.js';
import { LocalizationProvider } from '@material-ui/pickers';
import DateFnsUtils from '@material-ui/pickers/adapter/date-fns';
import { format, eachDayOfInterval, subDays } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import NumberFormat from 'react-number-format';
import { getStatistics, getSelection } from '../../services/user.js';

const DashboardVisualization = ({ display, handleSelectChange }) => {
  const [store, dispatch] = useContext(Context);
  const classes = {};

  return (
    <Box>
      <Grid item xs={12} md={6} className={classes.grid}>
        <Typography
          className="hidden sm:flex mx-0 sm:mx-12 capitalize"
          variant="h6"
        >
          {display.type}
        </Typography>
      </Grid>
      <Grid item xs={12} md={6} className={classes.grid}>
        <FormControl variant="outlined" className={classes.formControl}>
          <InputLabel id="data-display">Displayed data</InputLabel>
          <Select
            labelId="data-display"
            value={display.type}
            onChange={handleSelectChange}
            label="Displayed data"
            margin="dense"
          >
            <MenuItem value="purchases">Purchases</MenuItem>
            <MenuItem value="sales">Sales</MenuItem>
          </Select>
        </FormControl>
      </Grid>
    </Box>
  );
};

export default DashboardVisualization;
