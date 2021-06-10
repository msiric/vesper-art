import { makeStyles } from "@material-ui/core/styles";

const dashboardVisualizationStyles = makeStyles((muiTheme) => ({
  dashboardVisualizationChart: {
    height: 540,
    [muiTheme.breakpoints.down("xs")]: {
      height: 340,
    },
  },
  dashboardVisualizationCard: {
    padding: 8,
    height: "100%",
  },
  dashboardVisualizationWrapper: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
}));

export default dashboardVisualizationStyles;
