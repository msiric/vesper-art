import { makeStyles } from "@material-ui/core/styles";

const checkoutStatusStyles = makeStyles((muiTheme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evenly",
    alignItems: "center",
    height: "100%",
  },
  sentiment: {
    fontSize: "5rem",
  },
  message: {
    textAlign: "center",
  },
}));

export default checkoutStatusStyles;
