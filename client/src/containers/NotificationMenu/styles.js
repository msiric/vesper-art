import { makeStyles } from "@material-ui/core/styles";

const notificationMenuStyles = makeStyles(() => ({
  menu: {
    width: "100%",
    height: ({ height }) => height,
  },
  list: {
    width: "100%",
    maxWidth: 280,
  },
}));

export default notificationMenuStyles;
