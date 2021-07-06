import { makeStyles } from "@material-ui/core/styles";
import { artepunktTheme } from "../../styles/theme";

const commentCardStyles = makeStyles((muiTheme) => ({
  container: {
    padding: "0 12px",
  },
  highlight: {
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
  wrapper: {
    display: "flex",
  },
  owner: {
    textDecoration: "none",
  },
  details: {
    marginLeft: 6,
  },
}));

export default commentCardStyles;
