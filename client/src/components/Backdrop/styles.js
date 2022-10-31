import { makeStyles } from "@material-ui/core/styles";

const backdropStyles = makeStyles((muiTheme) => ({
  backdrop: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "100%",
    zIndex: muiTheme.zIndex.drawer + 1,
  },
}));

export default backdropStyles;
