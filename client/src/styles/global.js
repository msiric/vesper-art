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
  elementWidth: {
    width: "100%",
  },
  mainHeading: {
    marginBottom: 24,
  },
  dropdownOption: {
    [muiTheme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
  "@global": {
    ".illustrationPrimary": {
      fill: artepunktTheme.palette.primary.main,
    },
  },
}));

export default GlobalStyles;
