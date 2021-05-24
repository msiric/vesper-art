import { makeStyles } from "@material-ui/core/styles";
import { artepunktTheme } from "../../styles/theme";

const asyncButtonStyles = makeStyles((muiTheme) => ({
  buttonContainer: {
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: ({ padding }) => `${padding}px 0`,
  },
  buttonProgress: {
    color: artepunktTheme.palette.primary.main,
    position: "absolute",
  },
}));

export default asyncButtonStyles;
