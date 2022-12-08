import { makeStyles } from "@material-ui/core/styles";

const loadingSpinnerStyles = makeStyles(() => ({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    maxWidth: "100%",
    paddingLeft: 0,
    paddingRight: 0,
  },
  item: {
    display: "flex",
    justifyContent: "center",
    height: "100%",
    width: "100%",
    flexDirection: "column",
  },
  label: {
    margin: "6px auto",
    textAlign: "center",
  },
}));

export default loadingSpinnerStyles;
