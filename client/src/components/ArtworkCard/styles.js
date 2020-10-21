import { makeStyles } from "@material-ui/core/styles";
import { artepunktTheme } from "../../styles/theme.js";

const artworkCardStyles = makeStyles((muiTheme) => ({
  artworkCard: {
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
      "& $artworkHeader": {
        height: 60,
      },
      "& $artworkFooter": {
        height: 60,
      },
    },
  },
  artworkActions: {
    width: "100%",
    padding: "0 8px",
  },
  artworkContent: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textDecoration: "none",
    marginTop: -20,
    width: "100%",
  },
  artworkMedia: {
    display: "inline-block",
    backgroundSize: "contain",
    width: "100%",
  },
  artworkHeader: {
    textAlign: "center",
    width: "100%",
    color: artepunktTheme.palette.text.primary,
  },
  media: {
    height: 0,
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: muiTheme.transitions.create("transform", {
      duration: muiTheme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  artworkHeader: {
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
  },
  artworkFooter: {
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
  },
  artworkTitle: {
    color: "white",
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },
  },
  artworkSeller: {
    color: "white",
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },
  },
  root: {
    width: "100%",
  },
  accordion: {
    minHeight: 80,
  },
  heading: {
    fontSize: muiTheme.typography.pxToRem(15),
    flexBasis: "33.33%",
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: muiTheme.typography.pxToRem(15),
    color: muiTheme.palette.text.secondary,
  },
  buttonColor: {
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
