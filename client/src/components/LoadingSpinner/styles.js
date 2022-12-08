import { makeStyles } from "@material-ui/core/styles";

const loadingSpinnerStyles = makeStyles(() => ({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    maxWidth: "100%",
    position: "relative",
    height: ({ height }) => (height !== undefined ? height : "auto"),
    margin: ({ margin }) => (margin !== undefined ? margin : "auto"),
  },
  item: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "100%",
    padding: "12px 0",
    flexDirection: "column",
    top: "50%",
    left: "50%",
    transform: ({ height }) => (height ? "translate(-50%, -50%)" : "none"),
    position: ({ height }) => (height ? "absolute" : "static"),
  },
  circle: {
    "&>svg": {
      color: "rgba(255, 255, 255, 0.31)",
    },
  },
  label: {
    margin: "6px auto",
    textAlign: "center",
  },
}));

export default loadingSpinnerStyles;
