import { makeStyles } from "@material-ui/core/styles";
import { artepunktTheme } from "../../styles/theme";

const notificationItemStyles = makeStyles(() => ({
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
    "&>span": {
      borderRadius: "50%",
      transform: "scale(1, 0.75)",
    },
  },
  avatar: {
    display: "flex",
  },
  listItem: {
    alignItems: "flex-start",
  },
}));

export default notificationItemStyles;
