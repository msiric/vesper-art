import { makeStyles } from "@material-ui/core/styles";
import { artepunktTheme } from "../../styles/theme";

const headerStyles = makeStyles((muiTheme) => ({
  container: {
    backgroundColor: artepunktTheme.palette.background.paper,
    [muiTheme.breakpoints.down("xs")]: {
      padding: "12px 0",
    },
  },
  toolbar: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  wrapper: {
    display: "flex",
    alignItems: "center",
    width: "100%",
  },
  grow: {
    flex: 1,
  },
  logo: {
    width: 130,
    cursor: "pointer",
    display: "block",
  },
  search: {
    position: "relative",
    marginRight: muiTheme.spacing(2),
    marginLeft: muiTheme.spacing(3),
    width: "100%",
    maxWidth: 350,
    [muiTheme.breakpoints.down("sm")]: {
      maxWidth: 250,
    },
    [muiTheme.breakpoints.down("xs")]: {
      display: "none",
    },
  },
  searchMobile: {
    marginTop: 12,
    width: "100%",
    [muiTheme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  actions: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  margin: {
    margin: "0 4px",
  },
}));

export default headerStyles;
