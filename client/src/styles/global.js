import { makeStyles } from "@material-ui/core/styles";
import { artepunktTheme } from "./theme.js";

const GlobalStyles = makeStyles((muiTheme) => ({
  gridContainer: {
    padding: artepunktTheme.padding.container,
    margin: artepunktTheme.margin.container,
  },
  mainHeading: {
    marginBottom: 24,
  },
}));

export default GlobalStyles;
