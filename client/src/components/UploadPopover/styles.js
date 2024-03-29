import { makeStyles } from "@material-ui/core/styles";

const uploadPopoverStyles = makeStyles(() => ({
  container: {
    margin: "0 0 16px 0",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  wrapper: {
    padding: 16,
    maxWidth: 294,
  },
}));

export default uploadPopoverStyles;
