import { makeStyles } from "@material-ui/core/styles";

const settingsAccountStyles = makeStyles((muiTheme) => ({
  container: {
    marginBottom: 16,
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

export default settingsAccountStyles;
