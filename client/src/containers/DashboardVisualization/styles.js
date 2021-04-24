import { makeStyles } from "@material-ui/core/styles";

const dashboardVisualizationStyles = makeStyles((muiTheme) => ({
  dashboardVisualizationChart: {
    height: 540,
    [muiTheme.breakpoints.down("xs")]: {
      height: 340,
    },
  },
}));

export default dashboardVisualizationStyles;
