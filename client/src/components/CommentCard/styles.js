import { makeStyles } from "@material-ui/core/styles";
import { artepunktTheme } from "../../styles/theme";

const commentCardStyles = makeStyles((muiTheme) => ({
  container: {
    padding: "0 12px",
  },
  highlight: {
    border: "2px transparent solid",
    borderRadius: muiTheme.shape.borderRadius,
    animation: "$blink 0.8s",
    animationIterationCount: 3,
    backgroundColor: "#525252",
  },
  "@keyframes blink": {
    "50%": {
      borderColor: artepunktTheme.palette.primary.main,
    },
  },
  wrapper: {
    display: "flex",
    alignItems: "center",
  },
  owner: {
    textDecoration: "none",
    color: "white",
    "&:hover": {
      color: artepunktTheme.palette.primary.main,
    },
  },
  details: {
    marginLeft: 6,
    fontSize: 12,
  },
}));

export default commentCardStyles;
