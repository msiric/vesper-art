import { makeStyles } from "@material-ui/core/styles";

const settingsActionsStyles = makeStyles((muiTheme) => ({
  heading: {
    fontWeight: "bold",
    marginBottom: 12,
  },
  actions: {
    display: "flex",
    justifyContent: "flex-end",
  },
}));

export default settingsActionsStyles;
