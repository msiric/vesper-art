import { makeStyles } from "@material-ui/core/styles";
import { artepunktTheme } from "../../styles/theme";

const notificationItemStyles = makeStyles((muiTheme) => ({
  item: {
    cursor: "pointer",
    width: "100%",
  },
  link: {
    color: "white",
    textDecoration: "none",
    whiteSpace: "initial",
  },
  read: {
    backgroundColor: "",
  },
  unread: {
    backgroundColor: artepunktTheme.palette.primary.main,
  },
  icon: {
    position: "static",
    transform: "none",
  },
}));

export default notificationItemStyles;
