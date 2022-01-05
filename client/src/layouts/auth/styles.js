import { makeStyles } from "@material-ui/core/styles";

const AuthLayoutStyles = makeStyles((muiTheme) => ({
  appRoot: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
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
  appWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    margin: 24,
  },
  appLogo: {
    width: 175,
    marginBottom: 12,
    cursor: "pointer",
    display: "block",
  },
  appContainer: {
    maxWidth: 700,
    padding: "24px 0",
  },
}));

export default AuthLayoutStyles;
