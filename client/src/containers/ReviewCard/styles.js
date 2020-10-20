import { makeStyles } from "@material-ui/core/styles";
import { artepunktTheme } from "../../styles/theme";

const reviewCardStyles = makeStyles((muiTheme) => ({
  reviewContainer: {
    display: "flex",
    flexDirection: "column",
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
  reviewContent: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
}));

export default reviewCardStyles;
