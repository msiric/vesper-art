import { makeStyles } from "@material-ui/core/styles";

const checkoutItemStyles = makeStyles((muiTheme) => ({
  checkoutItemDescription: {
    "&:first-letter": {
      textTransform: "capitalize",
    },
  },
  checkoutItemPrice: {
    fontSize: "1rem",
  },
}));

export default checkoutItemStyles;
