import { makeStyles } from "@material-ui/core/styles";

const dashboardVisualizationStyles = makeStyles((muiTheme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    minHeight: 550,
  },
  card: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
    height: "100%",
    "& > span": {
      height: "99% !important",
      width: "99% !important",
      borderRadius: 20,
    },
  },
  chart: {
    height: "100%",
    width: "100%",
  },
  wrapper: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  content: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
  },
}));

export default dashboardVisualizationStyles;
