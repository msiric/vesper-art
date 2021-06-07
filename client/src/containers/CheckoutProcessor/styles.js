import { makeStyles } from "@material-ui/core/styles";

const checkoutProcessorStyles = makeStyles((muiTheme) => ({
  checkoutProcessorContainer: {
    margin: 0,
  },
  checkoutProcessorForm: {
    height: "100%",
  },
  checkoutProcessorCard: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  checkoutProcessorContent: {
    height: "100%",
  },
  checkoutProcessorWrapper: {
    height: "100%",
  },
  checkoutProcessorMultiform: {
    height: "100%",
  },
  checkoutProcessorActions: {
    display: "flex",
    justifyContent: "space-between",
  },
}));

export default checkoutProcessorStyles;
