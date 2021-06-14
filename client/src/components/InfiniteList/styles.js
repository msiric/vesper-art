import { makeStyles } from "@material-ui/core/styles";

const infiniteListStyles = makeStyles((muiTheme) => ({
  wrapper: {
    overflow: "hidden !important",
  },
  error: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  },
}));

export default infiniteListStyles;
