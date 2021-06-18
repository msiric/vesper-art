import { makeStyles } from "@material-ui/core/styles";

const notificationItemStyles = makeStyles((muiTheme) => ({
  item: {
    cursor: "pointer",
    width: "100%",
  },
  link: {
    fontWeight: "bold",
    color: "white",
    textDecoration: "none",
    whiteSpace: "initial",
  },
}));

export default notificationItemStyles;
