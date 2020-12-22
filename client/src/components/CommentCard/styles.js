import { makeStyles } from "@material-ui/core/styles";
import { artepunktTheme } from "../../styles/theme.js";

const commentCardStyles = makeStyles((muiTheme) => ({
  commentContainer: {
    padding: "0 12px",
  },
  highlightContainer: {
    border: "2px transparent solid",
    borderRadius: "4px",
    animation: "$blink 0.8s",
    animationIterationCount: 3,
    backgroundColor: "#525252",
  },
  "@keyframes blink": {
    "50%": {
      borderColor: artepunktTheme.palette.primary.main,
    },
  },
}));

export default commentCardStyles;
