import { makeStyles } from "@material-ui/core/styles";
import { artepunktTheme } from "../../styles/theme";

const AuthLayoutStyles = makeStyles((muiTheme) => ({
  appRoot: {
    display: "flex",
    flexFlow: "column",
    flexGrow: 1,
  },
  appBackdrop: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "100%",
    zIndex: muiTheme.zIndex.drawer + 1,
    color: "#fff",
  },
  appContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    marginTop: artepunktTheme.margin.container,
    marginBottom: artepunktTheme.margin.container,
  },
}));

export default AuthLayoutStyles;
