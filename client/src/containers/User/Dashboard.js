import {
  Container,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Typography,
} from "@material-ui/core";
import { LocalizationProvider } from "@material-ui/pickers";
import DateFnsUtils from "@material-ui/pickers/adapter/date-fns";
import { eachDayOfInterval, format, subDays } from "date-fns";
import React, { useContext, useEffect, useState } from "react";
import NumberFormat from "react-number-format";
import { Legend, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner.js";
import { UserContext } from "../../contexts/User.js";
import { getSelection, getStatistics } from "../../services/user.js";
import DateRangePicker from "../../shared/DateRangePicker/DateRangePicker.js";
import DashboardStyles from "./Dashboard.style.js";

function Dashboard() {
  const [userStore] = useContext(UserContext);
  const [state, setState] = useState({
    loading: true,
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
      type: "purchases",
      label: "spent",
    },
    dates: [new Date(subDays(new Date(), 7)), new Date()],
    visualization: false,
  });

  const classes = DashboardStyles();

  const fetchCurrentData = async () => {
    try {
      const { data } = await getStatistics.request({ userId: userStore.id });
      const currentStats = {
        review: data.statistics.rating,
        licenses: data.statistics.purchases
          .map((item) => item.licenses.length)
          .reduce((a, b) => a + b, 0),
        orders: data.statistics[state.display.type].length,
        spent: data.statistics.purchases.length
          ? data.statistics.purchases.reduce((a, b) => a + b.spent, 0)
          : 0,
        earned: data.statistics.sales.length
          ? data.statistics.sales.reduce((a, b) => a + b.earned, 0)
          : 0,
      };
      setState((prevState) => ({
        ...prevState,
        currentStats: currentStats,
        loading: false,
      }));
    } catch (err) {
      setState({ ...state, loading: false });
    }
  };

  const fetchSelectedData = async (from, to) => {
    try {
      setState({ ...state, loading: true });
      const { data } = await getSelection.request({
        userId: userStore.id,
        displayType: state.display.type,
        rangeFrom: from,
        rangeTo: to,
      });
      const selectedStats = {
        [state.display.label]: data.statistics.length
          ? data.statistics.reduce((a, b) => a + b[state.display.label], 0)
          : 0,
        licenses: {
          personal: 0,
          commercial: 0,
        },
      };
      const datesArray = eachDayOfInterval({
        start: new Date(from),
        end: new Date(to),
      });
      const graphData = {};
      for (let date of datesArray) {
        graphData[formatDate(date, "dd/MM/yyyy")] = {
          pl: 0,
          cl: 0,
        };
      }
      data.statistics.map((item) => {
        item.licenses.map((license) => {
          if (license.type === "personal") {
            selectedStats.licenses.personal++;
            if (graphData[formatDate(item.created, "dd/MM/yyyy")]) {
              graphData[formatDate(item.created, "dd/MM/yyyy")] = {
                ...graphData[formatDate(item.created, "dd/MM/yyyy")],
                pl: graphData[formatDate(item.created, "dd/MM/yyyy")].pl + 1,
              };
            } else {
              graphData.push({
                date: formatDate(item.created, "dd/MM/yyyy"),
                pl: 1,
              });
            }
          } else {
            selectedStats.licenses.commercial++;
            if (graphData[formatDate(item.created, "dd/MM/yyyy")]) {
              graphData[formatDate(item.created, "dd/MM/yyyy")] = {
                ...graphData[formatDate(item.created, "dd/MM/yyyy")],
                cl: graphData[formatDate(item.created, "dd/MM/yyyy")].cl + 1,
              };
            } else {
              graphData.push({
                date: formatDate(item.created, "dd/MM/yyyy"),
                cl: 1,
              });
            }
          }
        });
      });
      const formattedGraphData = Object.entries(graphData).map((item) => ({
        date: item[0],
        pl: item[1].pl,
        cl: item[1].cl,
      }));
      setState((prevState) => ({
        ...prevState,
        graphData: formattedGraphData,
        visualization: true,
        selectedStats: selectedStats,
        loading: false,
      }));
    } catch (err) {
      setState({ ...state, loading: false });
    }
  };

  const handleSelectChange = (e) => {
    setState((prevState) => ({
      ...prevState,
      display: {
        type: e.target.value,
        label: e.target.value === "purchases" ? "spent" : "earned",
      },
    }));
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
      const dateFrom = formatDate(new Date(state.dates[0]), "MM/dd/yyyy");
      const dateTo = formatDate(new Date(state.dates[1]), "MM/dd/yyyy");
      fetchSelectedData(dateFrom, dateTo);
    }
  }, [state.dates, state.display.type]);

  return (
    <LocalizationProvider dateAdapter={DateFnsUtils}>
      <Container className={classes.fixed}>
        <Grid container className={classes.container} spacing={2}>
          <>
            <Grid item xs={12} md={12} className={classes.grid}>
              <div className={classes.header}>
                <div className={classes.headerContent}>
                  <Typography className={classes.heading} variant="h4">
                    {userStore.name}
                  </Typography>
                </div>
              </div>
            </Grid>
            <Grid item xs={12} md={4} className={classes.grid}>
              <div className="flex items-center">
                <Typography
                  className="hidden sm:flex mx-0 sm:mx-12 capitalize"
                  variant="h6"
                >
                  {state.display.type}
                </Typography>
                <FormControl
                  variant="outlined"
                  className={classes.formControl}
                  style={{ marginBottom: "12px" }}
                >
                  <InputLabel id="data-display">Display</InputLabel>
                  <Select
                    labelId="data-display"
                    value={state.display.type}
                    onChange={handleSelectChange}
                    label="Display"
                    margin="dense"
                  >
                    <MenuItem value="purchases">Purchases</MenuItem>
                    <MenuItem value="sales">Sales</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <Paper className={classes.box}>
                {state.loading ? (
                  <Grid item xs={12} className={classes.loader}>
                    <LoadingSpinner />
                  </Grid>
                ) : state.display.type === "purchases" ? (
                  <div className={classes.boxData}>
                    <Typography className={classes.boxMain}>
                      {state.currentStats.licenses}
                    </Typography>
                    <Typography
                      className={classes.boxAlt}
                      color="textSecondary"
                    >
                      Licenses
                    </Typography>
                  </div>
                ) : (
                  <div className={classes.boxData}>
                    <Typography className={classes.boxMain}>
                      {state.currentStats.review || "/"}
                    </Typography>
                    <Typography
                      className={classes.boxAlt}
                      color="textSecondary"
                    >
                      Rating
                    </Typography>
                  </div>
                )}
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
                {state.loading ? (
                  <Grid item xs={12} className={classes.loader}>
                    <LoadingSpinner />
                  </Grid>
                ) : (
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
                )}
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
                {state.loading ? (
                  <Grid item xs={12} className={classes.loader}>
                    <LoadingSpinner />
                  </Grid>
                ) : (
                  <div className={classes.boxData}>
                    <Typography className={classes.boxMain}>
                      <NumberFormat
                        value={state.currentStats[state.display.label]}
                        displayType={"text"}
                        thousandSeparator={true}
                        decimalScale={2}
                        prefix={"$"}
                      />
                    </Typography>
                    <Typography
                      className={classes.boxAlt}
                      color="textSecondary"
                    >
                      {state.display.label}
                    </Typography>
                  </div>
                )}
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
                      ? "Visualization"
                      : "Select date range"}
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
                          {state.loading ? (
                            <Grid item xs={12} className={classes.loader}>
                              <LoadingSpinner />
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
                                domain={["dataMin", "dataMax"]}
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
                              <LoadingSpinner />
                            </Grid>
                          ) : (
                            <div className={classes.itemData}>
                              <Typography className={classes.itemMain}>
                                <NumberFormat
                                  value={
                                    state.selectedStats[state.display.label]
                                  }
                                  displayType={"text"}
                                  thousandSeparator={true}
                                  decimalScale={2}
                                  decimalScale={2}
                                  prefix={"$"}
                                />
                              </Typography>
                              <Typography
                                className={classes.itemAlt}
                                color="textSecondary"
                              >
                                {state.display.label}
                              </Typography>
                            </div>
                          )}
                          <Divider />
                        </Paper>
                        <Paper className={classes.item}>
                          {state.loading ? (
                            <Grid item xs={12} className={classes.loader}>
                              <LoadingSpinner />
                            </Grid>
                          ) : (
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
                          )}
                          <Divider />
                        </Paper>
                        <Paper className={classes.item}>
                          {state.loading ? (
                            <Grid item xs={12} className={classes.loader}>
                              <LoadingSpinner />
                            </Grid>
                          ) : (
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
                          )}
                          <Divider />
                        </Paper>
                      </div>
                    </Grid>
                  </div>
                )}
              </Paper>
            </Grid>
          </>
        </Grid>
      </Container>
    </LocalizationProvider>
  );
}

export default Dashboard;
