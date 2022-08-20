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
  },
  check: {
    fill: "none",
    opacity: 0,
    stroke: "#639939",
    strokeWidth: "4px",
    strokeLocation: "inside",
    strokeDasharray: "0 100",
    animationName: "$dasharray",
    animationDuration: "0.7s",
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
}));

export default animatedSuccessStyles;
