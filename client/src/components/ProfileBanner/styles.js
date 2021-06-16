import { makeStyles } from "@material-ui/core/styles";
import { artepunktTheme } from "../../styles/theme.js";

const profileBannerStyles = makeStyles((muiTheme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: artepunktTheme.padding.container,
    minHeight: 50,
    height: "100%",
  },
  banner: {
    height: 240,
    padding: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: artepunktTheme.palette.action.disabledBackground,
  },
  content: {
    padding: 24, // $TODO add global padding
  },
  infoWrapper: {
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
  avatarWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  avatar: {
    textAlign: "center",
    width: 130,
    height: 130,
    border: `6px solid ${artepunktTheme.palette.background.paper}`,
    borderRadius: "50%",
    marginBottom: 4,
    [muiTheme.breakpoints.down("sm")]: {
      width: 100,
      height: 100,
    },
    [muiTheme.breakpoints.down("xs")]: {
      width: 75,
      height: 75,
    },
  },
  aboutWrapper: {
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
  name: {
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
  detailsWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  item: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  icon: {
    marginRight: 3,
  },
  share: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: "6px",
    flexGrow: "1",
  },
  descriptionWrapper: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    flexDirection: "column",
  },
  label: {
    fontWeight: "bold",
  },
  description: {
    wordBreak: "break-word",
  },
}));

export default profileBannerStyles;
