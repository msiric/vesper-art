import { makeStyles } from "@material-ui/core/styles";

const notificationMenuStyles = makeStyles((muiTheme) => ({
  menu: {
    width: "100%",
  },
  list: {
    width: "100%",
    maxWidth: 280,
  },
  spinner: {
    height: "100%",
  },
}));

export default notificationMenuStyles;
