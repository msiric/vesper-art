import { Container, Divider, Grid } from "@material-ui/core";
import { LocalizationProvider } from "@material-ui/pickers";
import DateFnsUtils from "@material-ui/pickers/adapter/date-fns";
import React, { useEffect } from "react";
import DashboardStatistics from "../../containers/DashboardStatistics/index.js";
import DashboardToolbar from "../../containers/DashboardToolbar/index.js";
import DashboardVisualization from "../../containers/DashboardVisualization/index.js";
import VisualizationToolbar from "../../containers/VisualizationToolbar/index.js";
import { useUserStats } from "../../contexts/local/userStats";
import globalStyles from "../../styles/global.js";

const Dashboard = ({ location }) => {
  const resetStats = useUserStats((state) => state.resetStats);

  const globalClasses = globalStyles();

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
        <Grid container style={{ flexDirection: "column" }}>
          <DashboardToolbar />
          <DashboardStatistics layout="row" />
          <Grid item md={12}>
            <VisualizationToolbar />
            <Divider />
            <DashboardVisualization />
          </Grid>
        </Grid>
      </Container>
    </LocalizationProvider>
  );
};

export default Dashboard;
