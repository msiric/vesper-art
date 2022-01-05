import { makeStyles } from "@material-ui/core/styles";

const helpBoxStyles = makeStyles((muiTheme) => ({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    border: "1px solid",
    borderRadius: muiTheme.shape.borderRadius,
    padding: 8,
    width: "100%",
  },
  wrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    fontWeight: "bold",
    marginLeft: 8,
  },
}));

export default helpBoxStyles;
