import { makeStyles } from "@material-ui/core/styles";

const artworkCardStyles = makeStyles((muiTheme) => ({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    width: "100%",
    minWidth: 200,
    textDecoration: "none",
    boxShadow: "none",
    position: "relative",
    "&:hover": {
      "& $header": {
        height: 60,
      },
      "& $footer": {
        height: 60,
      },
    },
  },
  header: {
    "& div": {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      overflow: "hidden",
      padding: 12,
    },
    width: "100%",
    height: 0,
    padding: 0,
    position: "absolute",
    top: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    transition: "height 0.5s",
    display: "flex",
    justifyContent: "left",
    alignItems: "center",
    overflow: "hidden",
    zIndex: 100,
  },
  footer: {
    "& button": {
      color: "white",
    },
    width: "100%",
    height: 0,
    padding: 0,
    position: "absolute",
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    transition: "height 0.5s",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    overflow: "hidden",
    zIndex: 100,
  },
  buttonWrapper: {
    display: "flex",
  },
  title: {
    color: "white",
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },
  },
  owner: {
    color: "white",
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },
  },
  button: {
    color: "white",
    "& span": {
      color: "white",
      "& svg": {
        color: "white",
      },
    },
  },
}));

export default artworkCardStyles;
