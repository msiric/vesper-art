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
import { ResponsiveLine } from '@nivo/line';
import { useTheme } from '@material-ui/core/styles';
import ax from '../../axios.config';
import DashboardStyles from './Dashboard.style';

function Dashboard() {
  const [store, dispatch] = useContext(Context);
  const [state, setState] = useState({
    loading: false,
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
      console.log(data);
      const currentStats = {
        review: data.statistics.rating,
        orders: data.statistics[state.display.type].length,
        spent: data.statistics[state.display.type].length
          ? data.statistics[state.display.type].reduce(
              (a, b) => a + b[state.display.label]
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
          ? data.statistics.reduce((a, b) => a + b[state.display.label])
          : 0,
        licenses: {
          personal: 0,
          commercial: 0,
        },
      };
      data.statistics.map((item) => {
        item.licenses.map((license) => {
          if (license.type === 'personal') selectedStats.licenses.personal++;
          else selectedStats.licenses.commercial++;
        });
      });
      setState((prevState) => ({
        ...prevState,
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

  const formatDate = (date) => {
    return format(new Date(date), 'MM/dd/yyyy');
  };

  const data = [
    {
      id: 'japan',
      color: 'hsl(348, 70%, 50%)',
      data: [
        {
          x: 'plane',
          y: 84,
        },
        {
          x: 'helicopter',
          y: 102,
        },
        {
          x: 'boat',
          y: 128,
        },
        {
          x: 'train',
          y: 112,
        },
        {
          x: 'subway',
          y: 46,
        },
        {
          x: 'bus',
          y: 46,
        },
        {
          x: 'car',
          y: 146,
        },
        {
          x: 'moto',
          y: 59,
        },
        {
          x: 'bicycle',
          y: 41,
        },
        {
          x: 'horse',
          y: 284,
        },
        {
          x: 'skateboard',
          y: 143,
        },
        {
          x: 'others',
          y: 140,
        },
      ],
    },
  ];

  useEffect(() => {
    fetchCurrentData();
  }, []);

  useEffect(() => {
    if (state.dates[0] && state.dates[1]) {
      const dateFrom = formatDate(new Date(state.dates[0]));
      const dateTo = formatDate(new Date(state.dates[1]));
      console.log(dateFrom, dateTo);
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
                      {state.currentStats.review}
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
                            <ResponsiveLine
                              data={data}
                              margin={{
                                top: 50,
                                right: 110,
                                bottom: 50,
                                left: 60,
                              }}
                              xScale={{ type: 'point' }}
                              yScale={{
                                type: 'linear',
                                min: 0,
                                max: 'auto',
                                stacked: true,
                                reverse: false,
                              }}
                              curve="natural"
                              axisTop={null}
                              axisRight={null}
                              axisBottom={{
                                orient: 'bottom',
                                tickSize: 5,
                                tickPadding: 15,
                                tickRotation: 0,
                                legend: '',
                                legendOffset: 35,
                                legendPosition: 'middle',
                              }}
                              axisLeft={{
                                orient: 'left',
                                tickSize: 5,
                                tickPadding: 10,
                                tickRotation: 0,
                                legend: '',
                                legendOffset: -45,
                                legendPosition: 'middle',
                              }}
                              enableGridX={false}
                              enableGridY={false}
                              colors={{ scheme: 'nivo' }}
                              pointSize={8}
                              pointColor={{ theme: 'background' }}
                              pointBorderWidth={2}
                              pointBorderColor={{ from: 'serieColor' }}
                              pointLabel="y"
                              pointLabelYOffset={-12}
                              enableArea={true}
                              useMesh={true}
                            />
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
