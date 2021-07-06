import { makeStyles } from "@material-ui/core/styles";
import { artepunktTheme } from "../../styles/theme";

const HeaderStyles = makeStyles((muiTheme) => ({
  container: {
    backgroundColor: artepunktTheme.palette.background.paper,
  },
  grow: {
    flex: 1,
  },
  logo: {
    width: 100,
    display: "none",
    cursor: "pointer",
    [muiTheme.breakpoints.up("sm")]: {
      display: "block",
    },
  },
  search: {
    position: "relative",
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
  wrapper: {
    display: "flex",
  },
  margin: {
    marginRight: 6,
  },
}));

export default HeaderStyles;
