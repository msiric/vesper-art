import { makeStyles } from "@material-ui/core/styles";

const checkoutItemStyles = makeStyles((muiTheme) => ({
  description: {
    "&:first-letter": {
      textTransform: "capitalize",
    },
  },
  price: {
    fontSize: "1.2rem",
    fontWeight: "bold",
  },
  wrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
  },
}));

export default checkoutItemStyles;
