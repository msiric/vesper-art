import { makeStyles } from "@material-ui/core/styles";

const helpBoxStyles = makeStyles((muiTheme) => ({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    border: "1px solid",
    borderRadius: 4,
    padding: 8,
    width: "100%",
  },
  label: {
    fontWeight: "bold",
    marginLeft: 8,
  },
}));

export default helpBoxStyles;
