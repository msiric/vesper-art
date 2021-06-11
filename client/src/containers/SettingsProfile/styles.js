import { makeStyles } from "@material-ui/core/styles";

const settingsProfileStyles = makeStyles((muiTheme) => ({
  settingsContainer: {
    height: "100%",
  },
  settingsForm: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  settingsContent: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    flexGrow: 1,
    "&>div": {
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      flexGrow: 1,
    },
  },
  settingsActions: {
    display: "flex",
  },
}));

export default settingsProfileStyles;
