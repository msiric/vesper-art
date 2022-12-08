import { makeStyles } from "@material-ui/core/styles";
import { artepunktTheme } from "../../styles/theme";

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
    background: artepunktTheme.palette.background.light,
    position: "relative",
  },
  share: {
    position: "absolute",
    right: 0,
    bottom: 0,
  },
  content: {
    padding: 24, // $TODO Add global padding
    [muiTheme.breakpoints.down("xs")]: {
      padding: 12,
    },
  },
  infoWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: "-70px",
    [muiTheme.breakpoints.down("sm")]: {
      marginTop: "-52px",
    },
    [muiTheme.breakpoints.down("xs")]: {
      marginTop: "-34px",
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
    background: artepunktTheme.palette.background.light,
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
    flexGrow: 1,
    marginTop: "20px",
    marginLeft: "12px",
    [muiTheme.breakpoints.down("sm")]: {
      marginTop: "10px",
      marginLeft: "10px",
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
      maxWidth: "95%",
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
    [muiTheme.breakpoints.down("xs")]: {
      marginRight: 4,
    },
  },
  icon: {
    marginRight: 3,
  },
  value: {
    [muiTheme.breakpoints.down("xs")]: {
      fontSize: 12,
    },
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
