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
import { styled } from '@material-ui/core/styles';
import { compose, flexbox, typography } from '@material-ui/system';
import { artepunktTheme } from '../../constants/theme.js';

const GridItem = styled(Grid)(compose(typography));

const DashboardToolbar = ({ display, handleSelectChange }) => {
  const [store, dispatch] = useContext(Context);
  const classes = {};

  return (
    <Box display="flex" mb={artepunktTheme.margin.spacing} width="auto">
      <GridItem item xs={12} md={6}>
        <Typography style={{ textTransform: 'capitalize' }} variant="h6">
          Dashboard
        </Typography>
      </GridItem>
      <GridItem item xs={12} md={6} textAlign="right">
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
      </GridItem>
    </Box>
  );
};

export default DashboardToolbar;
