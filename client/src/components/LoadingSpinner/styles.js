import { makeStyles } from "@material-ui/core/styles";

const loadingSpinnerStyles = makeStyles((muiTheme) => ({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  item: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "100%",
    padding: "32px 0",
  },
  circle: {
    "&>svg": {
      color: "rgba(255, 255, 255, 0.31)",
    },
  },
  customPadding: {
    padding: "154px 0",
  },
}));

export default loadingSpinnerStyles;
