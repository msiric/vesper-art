import { makeStyles } from "@material-ui/core/styles";

const infiniteListStyles = makeStyles((muiTheme) => ({
  wrapper: {
    overflow: ({ height }) => (height ? "auto" : "hidden !important"),
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
