import { makeStyles } from "@material-ui/core";
import DateFnsUtils from "@material-ui/pickers/adapter/date-fns";
import React, { useEffect } from "react";
import DashboardStatistics from "../../containers/DashboardStatistics/index";
import DashboardToolbar from "../../containers/DashboardToolbar/index";
import DashboardVisualization from "../../containers/DashboardVisualization/index";
import VisualizationToolbar from "../../containers/VisualizationToolbar/index";
import { useUserStats } from "../../contexts/local/userStats";
import Container from "../../domain/Container";
import Grid from "../../domain/Grid";
import LocalizationProvider from "../../domain/LocalizationProvider";
import globalStyles from "../../styles/global";
import { containsErrors, renderError } from "../../utils/helpers";

const useDashboardStyles = makeStyles((muiTheme) => ({
  wrapper: {
    flexDirection: "column",
  },
}));

const Dashboard = ({}) => {
  const aggregateRetry = useUserStats(
    (state) => state.aggregateStats.error.retry
  );
  const aggregateRedirect = useUserStats(
    (state) => state.aggregateStats.error.redirect
  );
  const aggregateMessage = useUserStats(
    (state) => state.aggregateStats.error.message
  );
  const selectedRetry = useUserStats(
    (state) => state.selectedStats.error.retry
  );
  const selectedRedirect = useUserStats(
    (state) => state.selectedStats.error.redirect
  );
  const selectedMessage = useUserStats(
    (state) => state.selectedStats.error.message
  );
  const resetStats = useUserStats((state) => state.resetStats);

  const globalClasses = globalStyles();
  const classes = useDashboardStyles();

  const reinitializeState = () => {
    resetStats();
  };

  useEffect(() => {
    return () => {
      reinitializeState();
    };
  }, []);

  return !containsErrors(
    aggregateRetry,
    aggregateRedirect,
    selectedRetry,
    selectedRedirect
  ) ? (
    <LocalizationProvider dateAdapter={DateFnsUtils}>
      <Container className={globalClasses.gridContainer}>
        <Grid container spacing={2} className={classes.wrapper}>
          <Grid item xs={12}>
            <DashboardToolbar />
            <DashboardStatistics layout="row" />
            <VisualizationToolbar />
            <DashboardVisualization />
          </Grid>
        </Grid>
      </Container>
    </LocalizationProvider>
  ) : (
    renderError(
      {
        retry: aggregateRetry,
        redirect: aggregateRedirect,
        message: aggregateMessage,
      },
      {
        retry: selectedRetry,
        redirect: selectedRedirect,
        message: selectedMessage,
      }
    )
  );
};

export default Dashboard;
