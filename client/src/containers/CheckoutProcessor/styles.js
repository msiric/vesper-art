import { makeStyles } from "@material-ui/core/styles";

const checkoutProcessorStyles = makeStyles((muiTheme) => ({
  container: {
    margin: 0,
  },
  form: {
    height: "100%",
  },
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  content: {
    height: "100%",
  },
  wrapper: {
    height: "100%",
  },
  multiform: {
    height: "100%",
  },
  actions: {
    display: "flex",
    justifyContent: "space-between",
  },
}));

export default checkoutProcessorStyles;
