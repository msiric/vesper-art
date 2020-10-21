import { makeStyles } from "@material-ui/core/styles";

const loadingSpinnerStyles = makeStyles((muiTheme) => ({
  loadingSpinnerContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "100%",
  },
  loadingSpinnerItem: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "100%",
  },
  loadingSpinnerCircle: {
    "&>svg": {
      color: "rgba(255, 255, 255, 0.31)",
    },
  },
}));

export default loadingSpinnerStyles;
