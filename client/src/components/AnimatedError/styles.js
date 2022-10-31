import { makeStyles } from "@material-ui/core/styles";
import { artepunktTheme } from "@styles/theme";

const animatedErrorStyles = makeStyles((muiTheme) => ({
  error: {
    position: "absolute",
    width: 80,
    height: 80,
    top: "47%",
  },
  icon: {
    overflow: "visible",
  },
  circle: {
    fill: "transparent",
    stroke: artepunktTheme.palette.error.main,
    strokeWidth: 4,
    strokeDasharray: 224,
    transformOrigin: "50%",
    animation:
      "$spinner 1s linear 0s, $offset 1s ease-in-out 0s, $array 1s forwards",
  },
  line: {
    opacity: 0,
    fill: artepunktTheme.palette.error.main,
    animationName: "$rotate",
    animationDuration: "0.7s",
    animationDelay: "0.3s",
    animationTimingFunction: "ease-in-out",
    animationFillMode: "both",
    transformOrigin: "50% 50%",
  },
  "@keyframes rotate": {
    "0%": {
      transform: "rotate(0)",
    },
    "100%": {
      opacity: 1,
      transform: "rotate(315deg)",
    },
  },
  "@keyframes offset": {
    "0%": {
      strokeDashoffset: 224,
    },
    "100%": {
      strokeDashoffset: 0,
      transform: "rotate(360deg)",
    },
  },
  "@keyframes spinner": {
    "0%": {
      transform: "rotate(0deg)",
    },
    "100%": {
      transform: "rotate(270deg)",
    },
  },
  "@keyframes array": {
    "0%": {
      strokeDasharray: 224,
    },
    "100%": {
      strokeDasharray: 284,
    },
  },
}));

export default animatedErrorStyles;
