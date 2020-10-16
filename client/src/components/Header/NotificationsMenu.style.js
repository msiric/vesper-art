import { makeStyles } from "@material-ui/core/styles";

const NotificationsMenuStyles = makeStyles((muiTheme) => ({
  notificationMenu: {
    "&>.MuiPopover-paper": {
      minWidth: 400,
    },
  },
}));

export default NotificationsMenuStyles;
