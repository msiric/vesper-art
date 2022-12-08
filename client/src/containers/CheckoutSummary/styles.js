import { makeStyles } from "@material-ui/core/styles";

const checkoutSummaryStyles = makeStyles(() => ({
  container: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  content: {
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    paddingBottom: 8,
  },
  wrapper: {
    display: "flex",
  },
  actions: {
    width: "100%",
  },
  form: {
    width: "100%",
  },
  card: {
    flexBasis: "auto",
  },
}));

export default checkoutSummaryStyles;
