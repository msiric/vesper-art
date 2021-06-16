import { makeStyles } from "@material-ui/core/styles";

const pricingCardStyles = makeStyles((muiTheme) => ({
  container: {
    width: "100%",
    height: "100%",
  },
  content: {
    padding: "0 32px",
  },
  dataWrapper: {
    display: "flex",
    justifyContent: "center",
  },
  priceWrapper: {
    display: "flex",
    alignItems: "flex-end",
  },
  price: {
    fontSize: 48,
  },
  infoWrapper: {
    display: "flex",
    flexDirection: "column",
  },
  heading: {
    margin: 8,
  },
  actionsWrapper: {
    display: "flex",
    justifyContent: "center",
  },
}));

export default pricingCardStyles;
