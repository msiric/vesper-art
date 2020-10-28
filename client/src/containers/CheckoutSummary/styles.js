import { makeStyles } from "@material-ui/core/styles";

const checkoutSummaryStyles = makeStyles((muiTheme) => ({
  listContent: {
    "&:first-letter": {
      textTransform: "capitalize",
    },
  },
}));

export default checkoutSummaryStyles;
