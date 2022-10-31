import { makeStyles } from "@material-ui/core/styles";

const onboardedCardStyles = makeStyles((muiTheme) => ({
  content: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    maxWidth: 750,
    margin: "0 auto",
  },
  icon: {
    fontSize: 150,
  },
  heading: {
    marginBottom: 24,
    textAlign: "center",
  },
  text: {
    marginBottom: 4,
  },
  label: {
    textAlign: "center",
    marginBottom: 16,
  },
  list: {
    margin: "36px 0",
    width: "100%",
  },
  actions: {
    display: "flex",
    justifyContent: "space-between",
  },
  wrapper: {
    maxWidth: 280,
    width: "100%",
  },
}));

export default onboardedCardStyles;
