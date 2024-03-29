import { makeStyles } from "@material-ui/core/styles";
import { artepunktTheme } from "@styles/theme";

const swipeCardStyles = makeStyles(() => ({
  container: {
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    "&> div": {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
    },
    "&> div> div": {
      height: "100%",
      width: "100%",
      willChange: "initial !important",
      transition:
        "transform 0.35s cubic-bezier(0.15, 0.3, 0.25, 1) 0s !important",
    },
  },
  bar: {
    display: "flex",
    overflow: "hidden",
    borderTopLeftRadius: artepunktTheme.shape.borderRadius,
    borderTopRightRadius: artepunktTheme.shape.borderRadius,

    "& button:first-child": {
      borderTopLeftRadius: artepunktTheme.shape.borderRadius,
    },

    "& button:last-child": {
      borderTopRightRadius: artepunktTheme.shape.borderRadius,
    },
  },
  wrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  hidden: {
    display: "none",
  },
}));

export default swipeCardStyles;
