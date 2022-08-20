import { makeStyles } from "@material-ui/core/styles";

const animatedSuccessStyles = makeStyles((muiTheme) => ({
  success: {
    width: 50,
    height: 50,
    display: "inline-block",
  },
  icon: {
    overflow: "visible",
  },
  circle: {
    fill: "transparent",
    stroke: "#639939",
    strokeWidth: 4,
    strokeDasharray: 224,
    transformOrigin: "50%",
    animation:
      "$spinner 1s linear 0s, $offset 1s ease-in-out 0s, $array 1s forwards",
  },
  check: {
    fill: "none",
    opacity: 0,
    stroke: "#639939",
    strokeWidth: "4px",
    strokeLocation: "inside",
    strokeDasharray: "0 100",
    animationName: "$dasharray",
    animationDuration: "1.1s",
    animationDelay: "0.3s",
    animationTimingFunction: "ease-in-out",
    animationFillMode: "both",
  },
  "@keyframes dasharray": {
    "0%": {
      strokeDasharray: "0 100",
    },
    "100%": {
      opacity: 1,
      strokeDasharray: "100 0",
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

export default animatedSuccessStyles;
