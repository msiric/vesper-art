import { makeStyles } from "@material-ui/core/styles";

const pricingCardStyles = makeStyles(() => ({
  container: {
    width: "100%",
    height: "100%",
    boxShadow: "none",
    padding: "0 12px 12px",
  },
  dataWrapper: {
    display: "flex",
    justifyContent: "center",
  },
  extraMargin: {
    marginTop: 8,
  },
  priceWrapper: {
    display: "flex",
    alignItems: "flex-end",
  },
  price: {
    fontSize: 36,
  },
  infoWrapper: {
    display: "flex",
    flexDirection: "column",
  },
  heading: {
    margin: "8px 0",
    textAlign: "center",
  },
  actionsWrapper: {
    display: "flex",
    justifyContent: "center",
  },
}));

export default pricingCardStyles;
