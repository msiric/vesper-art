import { makeStyles } from "@material-ui/core/styles";

const dashboardToolbarStyles = makeStyles((muiTheme) => ({
  dashboardToolbarHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    "&:not(:last-child)": {
      marginBottom: 20,
    },
  },
}));

export default dashboardToolbarStyles;
