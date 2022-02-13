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
    minHeight: 160,
    maxHeight: 600,
    "&:hover": {
      "& $header": {
        height: 44,
      },
      "& $footer": {
        height: 44,
      },
      "& $imageContainer": {
        transform: "translate3d(0,0,0)", // uses GPU for better blur performance
        filter: "blur(6px)",
        opacity: 0.5,
      },
    },
  },
  imageContainer: {
    height: "100%",
    width: "100%",
    transition: "opacity 0.5s, filter 0.5s",
  },
  header: {
    "&>div": {
      overflow: "hidden",
      padding: 12,
    },
    width: "100%",
    height: 0,
    padding: 0,
    position: "absolute",
    top: 0,
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
    padding: "0 12px",
    height: 0,
    position: "absolute",
    bottom: 0,
    transition: "height 0.5s",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    overflow: "hidden",
    zIndex: 100,
  },
  labelWrapper: {
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  },
  buttonWrapper: {
    display: "flex",
  },
  title: {
    color: "white",
    textDecoration: "none",
    fontSize: "1rem",
    fontWeight: "bold",
    "&:hover": {
      textDecoration: "underline",
    },
    [muiTheme.breakpoints.down("md")]: {
      fontSize: "0.8rem",
    },
  },
  owner: {
    color: "white",
    textDecoration: "none",
    fontSize: "0.8rem",
    "&:hover": {
      textDecoration: "underline",
    },
    [muiTheme.breakpoints.down("md")]: {
      fontSize: "0.8rem",
    },
  },
  priceWrapper: {
    padding: 0,
  },
  price: {
    fontSize: "0.8rem",
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
