import { makeStyles } from "@material-ui/core/styles";

const checkoutItemStyles = makeStyles((muiTheme) => ({
  description: {
    "&:first-letter": {
      textTransform: "capitalize",
    },
  },
  price: {
    fontSize: "1rem",
    fontWeight: "bold",
  },
  label: {
    maxWidth: 260,
    "&>span": {
      display: "flex",
    },
    "&>p": {
      display: "flex",
    },
  },
  value: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
  },
}));

export default checkoutItemStyles;
