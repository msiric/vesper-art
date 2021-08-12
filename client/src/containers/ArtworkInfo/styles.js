import { makeStyles } from "@material-ui/core/styles";

const artworkInfoStyles = makeStyles((muiTheme) => ({
  content: {
    padding: 0,
  },
  wrapper: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    textAlign: "center",
    margin: 8,
  },
  alert: {
    textAlign: "center",
  },
  link: {
    color: "white",
    textAlign: "center",
  },
}));

export default artworkInfoStyles;
