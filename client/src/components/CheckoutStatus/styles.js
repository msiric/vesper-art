import { makeStyles } from "@material-ui/core/styles";

const checkoutStatusStyles = makeStyles((muiTheme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    height: "100%",
  },
  wrapper: {
    minHeight: 450,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  animation: {
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  summary: {
    marginBottom: 18,
  },
  message: {
    marginTop: 32,
    textAlign: "center",
  },
}));

export default checkoutStatusStyles;
