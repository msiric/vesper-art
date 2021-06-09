import { makeStyles } from "@material-ui/core/styles";

const dashboardToolbarStyles = makeStyles((muiTheme) => ({
  dashboardToolbarHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
  },
  dashboardToolbarForm: {
    marginBottom: 12,
  },
}));

export default dashboardToolbarStyles;
