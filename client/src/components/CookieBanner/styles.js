import { makeStyles } from "@material-ui/core/styles";
import { artepunktTheme } from "../../styles/theme";

const cookieBannerStyles = makeStyles((muiTheme) => ({
  container: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    position: "fixed",
    bottom: 0,
    width: "100%",
    zIndex: 999,
    boxShadow: `0 0px 10px 3px ${artepunktTheme.palette.background.default}`,
    background: artepunktTheme.palette.background.light,
    color: "#fff",
    padding: 16,
    borderRadius: 0,
    [muiTheme.breakpoints.down("sm")]: {
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "space-between",
      textAlign: "center",
    },
  },
  linkLabel: {
    display: "inline",
  },
  button: {
    marginLeft: 22,
    marginTop: 0,
    [muiTheme.breakpoints.down("sm")]: {
      marginLeft: 0,
      marginTop: 12,
    },
  },
  link: {
    fontSize: "1rem",
  },
}));

export default cookieBannerStyles;
