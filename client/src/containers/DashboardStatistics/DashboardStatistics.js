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
import DashboardCard from '../../components/DashboardCard/DashboardCard.js';

const DashboardStatistics = ({ loading, cards }) => {
  const [store, dispatch] = useContext(Context);
  const classes = {};

  return loading ? (
    <Box>
      {cards.map(() => (
        <Grid item xs={12} md={12 / cards.length} className={classes.loader}>
          <CircularProgress />
        </Grid>
      ))}
    </Box>
  ) : (
    <Box>
      {cards.map((card) => (
        <Grid item xs={12} md={12 / cards.length} className={classes.grid}>
          <DashboardCard
            currency={card.currency}
            data={card.data}
            label={card.label}
          />
        </Grid>
      ))}
    </Box>
  );
};

export default DashboardStatistics;
