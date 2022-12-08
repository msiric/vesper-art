import { makeStyles } from "@material-ui/core/styles";

const paymentDisclaimerStyles = makeStyles(() => ({
  container: {
    "&>div": {
      padding: "0px 8px !important",
    },
  },
  cards: {
    marginTop: 50,
  },
  wrapper: {
    display: "flex",
    alignItems: "center",
  },
  icon: {
    fontSize: 20,
    marginRight: 12,
  },
  disclaimer: {
    fontSize: 12,
  },
  redirect: {
    color: "#fff",
  },
}));

export default paymentDisclaimerStyles;
