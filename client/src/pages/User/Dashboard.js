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

const useDashboardStyles = makeStyles((muiTheme) => ({
  wrapper: {
    flexDirection: "column",
  },
}));

const Dashboard = ({}) => {
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

  return (
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
  );
};

export default Dashboard;
