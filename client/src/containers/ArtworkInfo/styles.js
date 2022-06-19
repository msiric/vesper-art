import { makeStyles } from "@material-ui/core/styles";

const artworkInfoStyles = makeStyles((muiTheme) => ({
  content: {
    padding: 0,
    "&:last-child": {
      paddingBottom: 0,
    },
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
}));

export default artworkInfoStyles;
