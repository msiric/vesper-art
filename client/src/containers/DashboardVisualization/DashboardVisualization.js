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
      <Box className={classes.graphArea}>
        <Grid item xs={12} md={8} className={classes.grid}>
          <div className={classes.graph}>
            <div className={classes.graphContainer}>
              {state.loading ? (
                <Grid item xs={12} className={classes.loader}>
                  <CircularProgress />
                </Grid>
              ) : (
                <LineChart
                  width={730}
                  height={400}
                  data={state.graphData}
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
            </div>
          </div>
        </Grid>
        <Grid item xs={12} md={4} className={classes.grid}>
          <div className={classes.controls}>
            <Paper className={classes.item}>
              {state.loading ? (
                <Grid item xs={12} className={classes.loader}>
                  <CircularProgress />
                </Grid>
              ) : (
                <div className={classes.itemData}>
                  <Typography className={classes.itemMain}>
                    <NumberFormat
                      value={state.selectedStats[state.display.label]}
                      displayType={'text'}
                      thousandSeparator={true}
                      decimalScale={2}
                      decimalScale={2}
                      prefix={'$'}
                    />
                  </Typography>
                  <Typography className={classes.itemAlt} color="textSecondary">
                    {state.display.label}
                  </Typography>
                </div>
              )}
              <Divider />
            </Paper>
            <Paper className={classes.item}>
              {state.loading ? (
                <Grid item xs={12} className={classes.loader}>
                  <CircularProgress />
                </Grid>
              ) : (
                <div className={classes.itemData}>
                  <Typography className={classes.itemMain}>
                    {state.selectedStats.licenses.personal}
                  </Typography>
                  <Typography className={classes.itemAlt} color="textSecondary">
                    Personal licenses
                  </Typography>
                </div>
              )}
              <Divider />
            </Paper>
            <Paper className={classes.item}>
              {state.loading ? (
                <Grid item xs={12} className={classes.loader}>
                  <CircularProgress />
                </Grid>
              ) : (
                <div className={classes.itemData}>
                  <Typography className={classes.itemMain}>
                    {state.selectedStats.licenses.commercial}
                  </Typography>
                  <Typography className={classes.itemAlt} color="textSecondary">
                    Commercial licenses
                  </Typography>
                </div>
              )}
              <Divider />
            </Paper>
          </div>
        </Grid>
      </Box>
    </Box>
  );
};

export default DashboardVisualization;
