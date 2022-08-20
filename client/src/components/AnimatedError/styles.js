import { makeStyles } from "@material-ui/core/styles";

const animatedErrorStyles = makeStyles((muiTheme) => ({
  error: {
    width: 50,
    height: 50,
    display: "inline-block",
  },
  icon: {
    overflow: "visible",
  },
  circle: {
    fill: "transparent",
    stroke: "#eb4034",
    strokeWidth: 4,
  },
  line: {
    opacity: 0,
    fill: "#eb4034",
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
}));

export default animatedErrorStyles;
