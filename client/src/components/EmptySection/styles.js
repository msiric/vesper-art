import { makeStyles } from "@material-ui/core/styles";

const emptySectionStyles = makeStyles((muiTheme) => ({
  container: {
    height: 500,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  wrapper: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "126px 0",
    height: "100%",
    cursor: "default",
  },
  icon: {
    fontSize: 56,
    marginBottom: 20,
  },
  label: {
    textTransform: "none",
    textAlign: "center",
  },
}));

export default emptySectionStyles;
