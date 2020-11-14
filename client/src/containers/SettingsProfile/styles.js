import { makeStyles } from "@material-ui/core/styles";

const settingsProfileStyles = makeStyles((muiTheme) => ({
  settingsProfileForm: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  settingsProfileContent: {
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
  settingsProfileActions: {
    display: "flex",
  },
}));

export default settingsProfileStyles;
