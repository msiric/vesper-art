import { makeStyles } from "@material-ui/core/styles";

const downloadCardStyles = makeStyles((muiTheme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: 24, // $TODO insert global padding here
    textAlign: "center",
  },
  label: {
    marginBottom: 20,
  },
}));

export default downloadCardStyles;