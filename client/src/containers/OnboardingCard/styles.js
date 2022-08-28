import { makeStyles } from "@material-ui/core/styles";

const onboardingCardStyles = makeStyles((muiTheme) => ({
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
  form: {
    maxWidth: 280,
    width: "100%",
  },
  actions: {
    display: "flex",
    justifyContent: "space-between",
  },
  wrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
}));

export default onboardingCardStyles;
