import { makeStyles } from "@material-ui/core/styles";

const settingsSecurityStyles = makeStyles((muiTheme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    justifyContent: "space-between",
  },
  actions: {
    display: "flex",
    justifyContent: "space-between",
  },
}));

export default settingsSecurityStyles;
