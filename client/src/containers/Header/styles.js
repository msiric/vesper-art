import { makeStyles } from "@material-ui/core/styles";
import { artepunktTheme } from "../../styles/theme";

const headerStyles = makeStyles((muiTheme) => ({
  header: {
    backgroundColor: artepunktTheme.palette.background.paper,
  },
  toolbar: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    margin: "0 auto",
    padding: "0 24px",
    [muiTheme.breakpoints.down("sm")]: {
      padding: "0 12px",
    },
    [muiTheme.breakpoints.down("xs")]: {
      padding: "12px 12px",
    },
  },
  wrapper: {
    display: "flex",
    alignItems: "center",
    width: "100%",
  },
  grow: {
    flex: 1,
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
