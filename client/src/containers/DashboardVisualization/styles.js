import { makeStyles } from "@material-ui/core/styles";

const dashboardVisualizationStyles = makeStyles((muiTheme) => ({
  chart: {
    height: 540,
    [muiTheme.breakpoints.down("xs")]: {
      height: 340,
    },
  },
  card: {
    padding: 8,
    height: "100%",
  },
  wrapper: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
}));

export default dashboardVisualizationStyles;
