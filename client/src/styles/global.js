import { makeStyles } from "@material-ui/core/styles";
import { artepunktTheme } from "./theme.js";

const GlobalStyles = makeStyles((muiTheme) => ({
  gridContainer: {
    padding: artepunktTheme.padding.containerLg,
    margin: artepunktTheme.margin.containerLg,
    [muiTheme.breakpoints.down("sm")]: {
      padding: artepunktTheme.padding.containerSm,
      margin: artepunktTheme.margin.containerSm,
    },
  },
  elementSpacing: {
    margin: artepunktTheme.margin.elementLg,
    [muiTheme.breakpoints.down("sm")]: {
      margin: artepunktTheme.margin.elementSm,
    },
  },
  mainHeading: {
    marginBottom: 24,
  },
  "@global": {
    ".illustrationPrimary": {
      fill: artepunktTheme.palette.primary.main,
    },
  },
}));

export default GlobalStyles;
