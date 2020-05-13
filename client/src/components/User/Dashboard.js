import React, { useContext, useState, useEffect } from 'react';
import { Context } from '../Store/Store';
import {
  Container,
  Grid,
  CircularProgress,
  Paper,
  IconButton,
  Icon,
  Button,
  Divider,
  Typography,
  TextField,
} from '@material-ui/core';
import DateRangePicker from '../../shared/DateRangePicker/DateRangePicker';
import { LocalizationProvider } from '@material-ui/pickers';
import DateFnsUtils from '@material-ui/pickers/adapter/date-fns';
import { format } from 'date-fns';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';
import { useTheme } from '@material-ui/core/styles';
import ax from '../../axios.config';
import DashboardStyles from './Dashboard.style';

function Dashboard() {
  const [store, dispatch] = useContext(Context);
  const [state, setState] = useState({
    loading: false,
    graphData: [
      {
        date: null,
        pl: 4000,
        cl: 2400,
      },
    ],
    currentStats: {},
    selectedStats: {},
    display: {
      type: 'purchases',
      label: 'spent',
    },
    dates: [null, null],
    visualization: false,
  });

  const theme = useTheme();
  const classes = DashboardStyles();

  const fetchCurrentData = async () => {
    try {
      const { data } = await ax.get(`/api/user/${store.user.id}/statistics`);
      const currentStats = {
        review: data.statistics.rating,
        orders: data.statistics[state.display.type].length,
        spent: data.statistics[state.display.type].length
          ? data.statistics[state.display.type].reduce(
              (a, b) => a + b[state.display.label],
              0
            )
          : 0,
      };
      setState((prevState) => ({ ...prevState, currentStats: currentStats }));
    } catch (err) {
      setState({ ...state, loading: false });
    }
  };

  const fetchSelectedData = async (from, to) => {
    try {
      const { data } = await ax.get(
        `/api/user/${store.user.id}/${[
          state.display.type,
        ]}?from=${from}&to=${to}`
      );
      const selectedStats = {
        spent: data.statistics.length
          ? data.statistics.reduce((a, b) => a + b[state.display.label], 0)
          : 0,
        licenses: {
          personal: 0,
          commercial: 0,
        },
      };
      const graphData = [];
      data.statistics.map((item) => {
        item.licenses.map((license) => {
          if (license.type === 'personal') {
            selectedStats.licenses.personal++;
            graphData.push({
              date: formatDate(item.created, 'dd/MM/yyyy'),
              pl: 1,
            });
          } else {
            selectedStats.licenses.commercial++;
            graphData.push({
              date: formatDate(item.created, 'dd/MM/yyyy'),
              cl: 1,
            });
          }
        });
      });
      setState((prevState) => ({
        ...prevState,
        graphData: graphData,
        visualization: true,
        selectedStats: selectedStats,
      }));
    } catch (err) {
      setState({ ...state, loading: false });
    }
  };

  const handleDateChange = (dates) => {
    setState((prevState) => ({ ...prevState, dates: dates }));
  };

  const formatDate = (date, type) => {
    return format(new Date(date), type);
  };

  useEffect(() => {
    fetchCurrentData();
  }, []);

  useEffect(() => {
    if (state.dates[0] && state.dates[1]) {
      const dateFrom = formatDate(new Date(state.dates[0]), 'MM/dd/yyyy');
      const dateTo = formatDate(new Date(state.dates[1]), 'MM/dd/yyyy');
      fetchSelectedData(dateFrom, dateTo);
    }
  }, [state.dates]);

  return (
    <LocalizationProvider dateAdapter={DateFnsUtils}>
      <Container fixed className={classes.fixed}>
        <Grid container className={classes.container} spacing={2}>
          {state.loading ? (
            <Grid item xs={12} className={classes.loader}>
              <CircularProgress />
            </Grid>
          ) : (
            <>
              <Grid item xs={12} md={12} className={classes.grid}>
                <div className={classes.header}>
                  <div className={classes.headerContent}>
                    <Typography className={classes.heading} variant="h4">
                      {store.user.name}
                    </Typography>
                  </div>
                </div>
              </Grid>
              <Grid item xs={12} md={4} className={classes.grid}>
                <Paper className={classes.box}>
                  <div className={classes.boxData}>
                    <Typography className={classes.boxMain}>
                      {state.currentStats.review || 'No reviews'}
                    </Typography>
                    <Typography
                      className={classes.boxAlt}
                      color="textSecondary"
                    >
                      Rating
                    </Typography>
                  </div>
                  <Divider />
                  <div className={classes.boxFooter}>
                    <Typography className={classes.text} color="textSecondary">
                      <span>WAT</span>:<b className={classes.count}>C</b>
                    </Typography>
                  </div>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4} className={classes.grid}>
                <Paper className={classes.box}>
                  <div className={classes.boxData}>
                    <Typography className={classes.boxMain}>
                      {state.currentStats.orders}
                    </Typography>
                    <Typography
                      className={classes.boxAlt}
                      color="textSecondary"
                    >
                      Orders
                    </Typography>
                  </div>
                  <Divider />
                  <div className={classes.boxFooter}>
                    <Typography className={classes.text} color="textSecondary">
                      <span>WAT</span>:<b className={classes.count}>C</b>
                    </Typography>
                  </div>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4} className={classes.grid}>
                <Paper className={classes.box}>
                  <div className={classes.boxData}>
                    <Typography className={classes.boxMain}>
                      ${state.currentStats[state.display.label]}
                    </Typography>
                    <Typography
                      className={classes.boxAlt}
                      color="textSecondary"
                    >
                      {state.display.label}
                    </Typography>
                  </div>
                  <Divider />
                  <div className={classes.boxFooter}>
                    <Typography className={classes.text} color="textSecondary">
                      <span>WAT</span>:<b className={classes.count}>C</b>
                    </Typography>
                  </div>
                </Paper>
              </Grid>
              <Grid item md={12} className={classes.grid}>
                <Paper className={classes.actions}>
                  <div className={classes.actionsContainer}>
                    <Typography className={classes.actionsHeading}>
                      {state.visualization
                        ? 'Visualization'
                        : 'Select date range'}
                    </Typography>
                    <DateRangePicker
                      fromLabel="From"
                      toLabel="To"
                      selectedDate={state.dates}
                      handleChange={(dates) => handleDateChange(dates)}
                    />
                  </div>
                  <Divider />
                  {state.visualization && (
                    <div className={classes.graphArea}>
                      <Grid item xs={12} md={8} className={classes.grid}>
                        <div className={classes.graph}>
                          <div className={classes.graphContainer}>
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
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="date" />
                              <YAxis allowDecimals={false} />
                              <Tooltip />
                              <Legend />
                              <Line
                                name="Personal licenses"
                                type="monotone"
                                dataKey="pl"
                                stroke="#8884d8"
                              />
                              <Line
                                name="Commercial licenses"
                                type="monotone"
                                dataKey="cl"
                                stroke="#82ca9d"
                              />
                            </LineChart>
                          </div>
                        </div>
                      </Grid>
                      <Grid item xs={12} md={4} className={classes.grid}>
                        <div className={classes.controls}>
                          <Paper className={classes.item}>
                            <div className={classes.itemData}>
                              <Typography className={classes.itemMain}>
                                ${state.selectedStats[state.display.label]}
                              </Typography>
                              <Typography
                                className={classes.itemAlt}
                                color="textSecondary"
                              >
                                {state.display.label}
                              </Typography>
                            </div>
                            <Divider />
                          </Paper>
                          <Paper className={classes.item}>
                            <div className={classes.itemData}>
                              <Typography className={classes.itemMain}>
                                {state.selectedStats.licenses.personal}
                              </Typography>
                              <Typography
                                className={classes.itemAlt}
                                color="textSecondary"
                              >
                                Personal licenses
                              </Typography>
                            </div>
                            <Divider />
                          </Paper>
                          <Paper className={classes.item}>
                            <div className={classes.itemData}>
                              <Typography className={classes.itemMain}>
                                {state.selectedStats.licenses.commercial}
                              </Typography>
                              <Typography
                                className={classes.itemAlt}
                                color="textSecondary"
                              >
                                Commercial licenses
                              </Typography>
                            </div>
                            <Divider />
                          </Paper>
                        </div>
                      </Grid>
                    </div>
                  )}
                </Paper>
              </Grid>
            </>
          )}
        </Grid>
      </Container>
    </LocalizationProvider>
  );
}

export default Dashboard;
