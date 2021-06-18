import { fade, makeStyles } from "@material-ui/core/styles";
import { artepunktTheme } from "../../styles/theme.js";

const HeaderStyles = makeStyles((muiTheme) => ({
  headerContainer: {
    backgroundColor: artepunktTheme.palette.background.paper,
  },
  grow: {
    flex: 1,
  },
  menuButton: {
    marginRight: muiTheme.spacing(2),
  },
  logoDesktop: {
    width: 100,
    display: "none",
    cursor: "pointer",
    [muiTheme.breakpoints.up("sm")]: {
      display: "block",
    },
  },
  logoMobile: {
    display: "block",
    width: 18,
    marginRight: 16,
    cursor: "pointer",
    [muiTheme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  search: {
    position: "relative",
    borderRadius: muiTheme.shape.borderRadius,
    backgroundColor: fade(muiTheme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(muiTheme.palette.common.white, 0.25),
    },
    marginRight: muiTheme.spacing(1),
    marginLeft: 0,
    width: "100%",
    [muiTheme.breakpoints.up("sm")]: {
      marginLeft: muiTheme.spacing(3),
      width: "auto",
    },
    [muiTheme.breakpoints.up("md")]: {
      marginRight: muiTheme.spacing(2),
    },
  },
  typeIcon: {
    height: "100%",
    position: "absolute",
    zIndex: 1000,
    display: "flex",
    alignItems: "center",
    borderRadius: 4,
    padding: 6,
    "&:hover": {
      backgroundColor: "rgba(0, 0, 0, 0.08)",
    },
    [muiTheme.breakpoints.up("md")]: {
      padding: 12,
    },
  },
  searchIcon: {
    top: 0,
    right: 0,
    height: "100%",
    position: "absolute",
    zIndex: 1000,
    display: "flex",
    alignItems: "center",
    borderRadius: 4,
    padding: 6,
    "&:hover": {
      backgroundColor: "rgba(0, 0, 0, 0.08)",
    },
    [muiTheme.breakpoints.up("md")]: {
      padding: 12,
    },
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: muiTheme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${muiTheme.spacing(3)}px)`,
    paddingRight: `calc(1em + ${muiTheme.spacing(3)}px)`,
    transition: muiTheme.transitions.create("width"),
    width: "100%",
    [muiTheme.breakpoints.up("md")]: {
      width: "20ch",
    },
    [muiTheme.breakpoints.up("md")]: {
      paddingLeft: `calc(1em + ${muiTheme.spacing(5)}px)`,
      paddingRight: `calc(1em + ${muiTheme.spacing(5)}px)`,
    },
  },
  sectionDesktop: {
    display: "flex",
  },
}));

export default HeaderStyles;
