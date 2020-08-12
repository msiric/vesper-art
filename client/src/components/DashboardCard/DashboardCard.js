import React, { useContext, useState, useEffect } from 'react';
import { Context } from '../../context/Store.js';
import {
  Card,
  CardHeader,
  CardContent,
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
import {
  compose,
  flexbox,
  typography,
  border,
  sizing,
  spacing,
} from '@material-ui/system';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner.js';

const CardContainer = styled(Card)(compose(spacing, flexbox, sizing));
const CardItem = styled(CardContent)(compose(spacing, flexbox, sizing));

const DashboardCard = ({ currency, data, label, loading }) => {
  const [store, dispatch] = useContext(Context);
  const classes = {};

  return (
    <CardContainer
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      border={1}
      height={180}
      m={1}
    >
      <CardItem
        style={{ display: 'flex' }}
        justifyContent="center"
        alignItems="center"
        height={120}
      >
        {loading ? (
          <LoadingSpinner />
        ) : currency ? (
          <NumberFormat
            value={data}
            displayType={'text'}
            thousandSeparator={true}
            decimalScale={2}
            prefix={'$'}
            style={{
              fontSize: '3.5rem',
              textAlign: 'center',
              display: 'block',
              height: 84,
            }}
          />
        ) : (
          <Typography
            className={classes.boxMain}
            style={{ fontSize: '3.5rem' }}
            align="center"
          >
            {data}
          </Typography>
        )}
      </CardItem>
      <Divider />
      <CardItem
        style={{ display: 'flex' }}
        justifyContent="center"
        alignItems="center"
        height={60}
      >
        <Typography
          className={classes.boxAlt}
          color="textSecondary"
          style={{ textTransform: 'capitalize' }}
          align="center"
        >
          {label}
        </Typography>
      </CardItem>
    </CardContainer>
  );
};

export default DashboardCard;
