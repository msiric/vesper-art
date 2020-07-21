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

const DashboardCard = ({ currency, data, label }) => {
  const [store, dispatch] = useContext(Context);
  const classes = {};

  return currency ? (
    <Box>
      <NumberFormat
        value={data}
        displayType={'text'}
        thousandSeparator={true}
        decimalScale={2}
        prefix={'$'}
      />
      <Typography className={classes.boxAlt} color="textSecondary">
        {label}
      </Typography>
    </Box>
  ) : (
    <Box>
      <Box className={classes.boxData}>
        <Typography className={classes.boxMain}>{data}</Typography>
      </Box>
      <Divider />
      <Box className={classes.boxFooter}>
        <Typography className={classes.text} color="textSecondary">
          {label}
        </Typography>
      </Box>
    </Box>
  );
};

export default DashboardCard;
