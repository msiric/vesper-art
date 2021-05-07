import { makeStyles } from "@material-ui/core/styles";

const checkoutSummaryStyles = makeStyles((muiTheme) => ({
  checkoutSummaryRoot: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  checkoutSummaryContent: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    paddingBottom: 8,
  },
  checkoutSummaryActions: {
    width: "100%",
  },
  checkoutSummaryForm: {
    width: "100%",
  },
}));

export default checkoutSummaryStyles;
