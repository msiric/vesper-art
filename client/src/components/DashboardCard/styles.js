import { makeStyles } from "@material-ui/core/styles";

const dashboardCardStyles = makeStyles((muiTheme) => ({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    border: 1,
    height: 180,
  },
  dataWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 120,
  },
  data: {
    fontSize: "3.5rem",
    textAlign: "center",
  },
  value: {
    fontSize: "3.5rem",
    textAlign: "center",
    display: "block",
    height: 84,
  },
  labelWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 60,
  },
  label: {
    textTransform: "capitalize",
    textAlign: "center",
  },
}));

export default dashboardCardStyles;
