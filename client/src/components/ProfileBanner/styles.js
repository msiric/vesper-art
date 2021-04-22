import { makeStyles } from "@material-ui/core/styles";
import { artepunktTheme } from "../../styles/theme.js";

const profileBannerStyles = makeStyles((muiTheme) => ({
  profileCardContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: artepunktTheme.padding.container,
    minHeight: 50,
    height: "100%",
  },
  profileCardInfo: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: "-70px",
    [muiTheme.breakpoints.down("sm")]: {
      marginTop: "-45px",
    },
    [muiTheme.breakpoints.down("xs")]: {
      marginTop: "-32.5px",
    },
  },
  profileCardAvatar: {
    textAlign: "center",
    width: 130,
    height: 130,
    borderRadius: "50%",
    [muiTheme.breakpoints.down("sm")]: {
      width: 100,
      height: 100,
    },
    [muiTheme.breakpoints.down("xs")]: {
      width: 75,
      height: 75,
    },
  },
  profileCardAbout: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    flexDirection: "column",
    marginTop: "12px",
    marginLeft: "12px",
    [muiTheme.breakpoints.down("sm")]: {
      marginTop: "24px",
      marginLeft: "10px",
      maxWidth: "52%",
    },
    [muiTheme.breakpoints.down("xs")]: {
      marginTop: "16px",
      marginLeft: "8px",
    },
  },
  profileCardName: {
    fontWeight: "bold",
    [muiTheme.breakpoints.down("sm")]: {
      fontSize: "1.75rem",
    },
    [muiTheme.breakpoints.down("xs")]: {
      fontSize: "1.25rem",
    },
    [muiTheme.breakpoints.down(410)]: {
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      maxWidth: "100%",
    },
  },
  profileCardDescription: {
    wordBreak: "break-word",
  },
}));

export default profileBannerStyles;
