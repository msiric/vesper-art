import { makeStyles } from "@material-ui/core/styles";

const checkoutCardStyles = makeStyles((muiTheme) => ({
  checkoutCardContainer: {
    padding: 0,
    margin: "16px 0",
  },
  checkoutCardMedia: {
    height: "100%",
    width: "100%",
    borderRadius: 4,
    backgroundSize: "contain",
  },
  checkoutCardInfo: {
    display: "flex",
    flexDirection: "column",
  },
  checkoutCardText: {
    padding: "0 16px",
    margin: 0,
  },
}));

export default checkoutCardStyles;
