import { makeStyles } from "@material-ui/core/styles";

const swipeCardStyles = makeStyles((muiTheme) => ({
  container: {
    height: "100%",
    width: "100%",
    "&> div": {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "calc(100% - 48px)",
    },
    "&> div> div": {
      height: "100%",
      width: "100%",
      transition:
        "transform 0.35s cubic-bezier(0.15, 0.3, 0.25, 1) 0s !important",
    },
  },
  bar: {
    marginBottom: 10,
  },
  wrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
}));

export default swipeCardStyles;
