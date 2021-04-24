import { makeStyles } from "@material-ui/core/styles";
import { artepunktTheme } from "../../styles/theme";

const visualizationToolbarStyles = makeStyles((muiTheme) => ({
  visualizationToolbarHeader: {
    display: "flex",
    alignItems: "center",
    margin: artepunktTheme.margin.elementLg,
    [muiTheme.breakpoints.down("xs")]: {
      flexDirection: "column",
    },
  },
  visualizationToolbarHeading: {
    [muiTheme.breakpoints.down("xs")]: {
      marginBottom: artepunktTheme.margin.headingLg,
    },
  },
}));

export default visualizationToolbarStyles;
