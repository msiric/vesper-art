import { makeStyles } from "@material-ui/core";
import DateFnsUtils from "@material-ui/pickers/adapter/date-fns";
import React, { useEffect } from "react";
import DashboardStatistics from "../../containers/DashboardStatistics/index.js";
import DashboardToolbar from "../../containers/DashboardToolbar/index.js";
import DashboardVisualization from "../../containers/DashboardVisualization/index.js";
import VisualizationToolbar from "../../containers/VisualizationToolbar/index.js";
import { useUserStats } from "../../contexts/local/userStats";
import Container from "../../domain/Container";
import Grid from "../../domain/Grid";
import LocalizationProvider from "../../domain/LocalizationProvider";
import globalStyles from "../../styles/global.js";
import { containsErrors, renderError } from "../../utils/helpers.js";

const useDashboardStyles = makeStyles((muiTheme) => ({
  wrapper: {
    flexDirection: "column",
  },
}));

const Dashboard = ({}) => {
  const aggregateRetry = useUserStats(
    (state) => state.aggregateStats.error.retry
  );
  const aggregateMessage = useUserStats(
    (state) => state.aggregateStats.error.message
  );
  const selectedRetry = useUserStats(
    (state) => state.selectedStats.error.retry
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

  return !containsErrors(aggregateRetry, selectedRetry) ? (
    <LocalizationProvider dateAdapter={DateFnsUtils}>
      <Container className={globalClasses.gridContainer}>
        <Grid container className={classes.wrapper}>
          <DashboardToolbar />
          <DashboardStatistics layout="row" />
          <VisualizationToolbar />
          <DashboardVisualization />
        </Grid>
      </Container>
    </LocalizationProvider>
  ) : (
    renderError(
      { retry: aggregateRetry, message: aggregateMessage },
      { retry: selectedRetry, message: selectedMessage }
    )
  );
};

export default Dashboard;
