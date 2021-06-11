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
  reviewCard: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    flexGrow: 1,
  },
  reviewWrapper: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: "100%",
  },
  reviewText: {
    margin: 8,
  },
  reviewActions: {
    width: "100%",
    display: "flex",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
}));

export default reviewCardStyles;
