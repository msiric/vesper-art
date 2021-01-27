import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Typography,
} from "@material-ui/core";
import { LocalizationProvider } from "@material-ui/pickers";
import DateFnsUtils from "@material-ui/pickers/adapter/date-fns";
import { eachDayOfInterval, format, subDays } from "date-fns";
import React, { useEffect, useState } from "react";
import DashboardStatistics from "../../containers/DashboardStatistics/index.js";
import DashboardToolbar from "../../containers/DashboardToolbar/index.js";
import DashboardVisualization from "../../containers/DashboardVisualization/index.js";
import { useTracked as useUserContext } from "../../contexts/global/User.js";
import RangeInput from "../../controls/RangeInput/index.js";
import { getDashboard } from "../../services/stripe.js";
import { getSelection, getStatistics } from "../../services/user.js";
import globalStyles from "../../styles/global.js";

const initialState = {
  loading: true,
  graphData: [
    {
      date: null,
      pl: 0,
      cl: 0,
    },
  ],
  currentStats: {},
  selectedStats: {
    licenses: {},
    loading: true,
  },
  display: {
    type: "purchases",
    label: "spent",
  },
  dates: [new Date(subDays(new Date(), 7)), new Date()],
  visualization: false,
};

const Dashboard = ({ location }) => {
  const [userStore] = useUserContext();
  const [state, setState] = useState({
    ...initialState,
  });

  const globalClasses = globalStyles();

  const fetchCurrentData = async () => {
    try {
      setState((prevState) => ({ ...prevState, loading: true }));
      const { data } = await getStatistics.request({
        userId: userStore.id,
        display: state.display.type,
      });
      const currentStats = {
        rating:
          data.reviews && data.reviews.length
            ? data.reviews.reduce((a, b) => a + b.rating, 0) /
              data.reviews.length
            : 0,
        favorites: data.favorites ? data.favorites.length : 0,
        orders: data[state.display.type].length,
        [state.display.label]: data[state.display.type].length
          ? data[state.display.type].reduce(
              (a, b) => a + b[state.display.label],
              0
            )
          : 0,
      };
      setState((prevState) => ({
        ...prevState,
        currentStats: currentStats,
        loading: false,
        selectedStats: {
          ...prevState.selectedStats,
          loading: false,
        },
      }));
    } catch (err) {
      console.log(err);
      setState((prevState) => ({
        ...prevState,
        loading: false,
        selectedStats: {
          ...prevState.selectedStats,
          loading: false,
        },
      }));
    }
  };

  const fetchSelectedData = async (from, to) => {
    try {
      setState((prevState) => ({
        ...prevState,
        selectedStats: {
          ...prevState.selectedStats,
          loading: true,
        },
      }));
      const { data } = await getSelection.request({
        userId: userStore.id,
        displayType: state.display.type,
        start: from,
        end: to,
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
        if (item.license.type === "personal") {
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
      const formattedGraphData = Object.entries(graphData).map((item) => ({
        date: item[0],
        pl: item[1].pl,
        cl: item[1].cl,
      }));
      setState((prevState) => ({
        ...prevState,
        graphData: formattedGraphData,
        visualization: true,
        selectedStats: { ...selectedStats, loading: false },
      }));
    } catch (err) {
      setState({
        ...state,
        selectedStats: { ...state.selectedStats, loading: false },
      });
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

  const handleStripeRedirect = async () => {
    const { data } = await getDashboard.request({
      stripeId: userStore.stripeId,
    });
    window.location.href = data.url;
  };

  useEffect(() => {
    fetchCurrentData();
  }, [location, state.display.type]);

  useEffect(() => {
    if (state.dates[0] && state.dates[1]) {
      const dateFrom = formatDate(new Date(state.dates[0]), "MM/dd/yyyy");
      const dateTo = formatDate(new Date(state.dates[1]), "MM/dd/yyyy");
      fetchSelectedData(dateFrom, dateTo);
    }
  }, [state.dates, state.display.type]);

  return (
    <LocalizationProvider dateAdapter={DateFnsUtils}>
      <Container key={location.key} className={globalClasses.gridContainer}>
        <Grid container style={{ flexDirection: "column" }}>
          <DashboardToolbar
            display={state.display}
            handleSelectChange={handleSelectChange}
          />
          {userStore.stripeId && (
            <Button variant="outlined" onClick={handleStripeRedirect}>
              Stripe dashboard
            </Button>
          )}
          <DashboardStatistics
            loading={state.loading}
            cards={[
              {
                data:
                  state.display.type === "purchases"
                    ? state.currentStats.favorites
                    : state.currentStats.rating || "/",
                label:
                  state.display.type === "purchases" ? "Favorites" : "Rating",
                currency: false,
              },
              {
                data: state.currentStats.orders,
                label: "Orders",
                currency: false,
              },
              {
                data: state.currentStats[state.display.label],
                label: state.display.label,
                currency: true,
              },
            ]}
            layout="row"
          />
          <Grid item md={12}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography style={{ textTransform: "capitalize" }} variant="h6">
                {state.loading || state.visualization
                  ? "Visualization"
                  : "Select date range"}
              </Typography>
              <RangeInput
                fromLabel="From"
                toLabel="To"
                selectedDate={state.dates}
                handleChange={(dates) => handleDateChange(dates)}
              />
            </Box>
            <Divider />
            {(state.selectedStats.loading || state.visualization) && (
              <DashboardVisualization
                display={state.display}
                graphData={state.graphData}
                selectedStats={state.selectedStats}
                loading={state.selectedStats.loading}
              />
            )}
          </Grid>
        </Grid>
      </Container>
    </LocalizationProvider>
  );
};

export default Dashboard;
