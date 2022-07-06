import { makeStyles } from "@material-ui/core/styles";
import { artepunktTheme } from "../../styles/theme";

const commentCardStyles = makeStyles((muiTheme) => ({
  container: {
    padding: "0 12px",
    position: "relative",
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
  avatar: {
    display: "flex",
  },
  wrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  owner: {
    textDecoration: "none",
    color: "white",
    alignSelf: "flex-start",
    "&:hover": {
      color: artepunktTheme.palette.primary.main,
    },
  },
  modified: {
    marginLeft: 6,
    fontSize: 11,
    color: "white",
  },
  created: {
    fontSize: 11,
    color: "white",
  },
  actions: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  form: {
    margin: "4px 0",
  },
  menu: {
    top: 6,
    transform: "none",
  },
  button: {
    padding: 0,
  },
  details: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  content: {
    wordBreak: "break-word",
  },
  subtitle: {
    display: "flex",
  },
}));

export default commentCardStyles;
