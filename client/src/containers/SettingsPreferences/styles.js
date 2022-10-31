import { makeStyles } from "@material-ui/core/styles";

const settingsPreferencesStyles = makeStyles((muiTheme) => ({
  container: {
    marginBottom: 16,
  },
  actions: {
    display: "flex",
    justifyContent: "space-between",
  },
}));

export default settingsPreferencesStyles;
