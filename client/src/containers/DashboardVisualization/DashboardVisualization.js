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
import SelectInput from '@material-ui/core/Select/SelectInput';
import DashboardCard from '../../components/DashboardCard/DashboardCard.js';
import DashboardStatistics from '../DashboardStatistics/DashboardStatistics.js';

const DashboardVisualization = ({
  display,
  handleSelectChange,
  graphData,
  selectedStats,
  loading,
}) => {
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
        <SelectInput
          name="displayType"
          label="Displayed data"
          handleChange={handleSelectChange}
          options={[
            { value: 'purchases', text: 'Purchases' },
            { value: 'sales', text: 'Sales' },
          ]}
        />
      </Grid>
      <Box className={classes.graphArea}>
        <Grid item xs={12} md={8} className={classes.grid}>
          <Box className={classes.graph}>
            <Box className={classes.graphContainer}>
              {loading ? (
                <Grid item xs={12} className={classes.loader}>
                  <CircularProgress />
                </Grid>
              ) : (
                <LineChart
                  width={730}
                  height={400}
                  data={graphData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <XAxis dataKey="date" />
                  <YAxis
                    allowDecimals={false}
                    domain={['dataMin', 'dataMax']}
                  />
                  <Tooltip />
                  <Legend />
                  <Line
                    name="Personal licenses"
                    type="monotone"
                    dataKey="pl"
                    stroke="#8884d8"
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    name="Commercial licenses"
                    type="monotone"
                    dataKey="cl"
                    stroke="#82ca9d"
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              )}
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={4} className={classes.grid}>
          <DashboardStatistics
            loading={loading}
            cards={[
              {
                data: selectedStats[display.label],
                label: display.label,
                currency: true,
              },
              {
                data: selectedStats.license.personal,
                label: 'Personal licenses',
                currency: false,
              },
              {
                data: selectedStats.license.commercial,
                label: 'Commercial licenses',
                currency: false,
              },
            ]}
          />
        </Grid>
      </Box>
    </Box>
  );
};

export default DashboardVisualization;
