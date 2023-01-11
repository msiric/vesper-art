import { makeStyles } from "@material-ui/core/styles";
import { artepunktTheme } from "../../styles/theme";

const visualizationToolbarStyles = makeStyles((muiTheme) => ({
  container: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    margin: artepunktTheme.margin.elementLg,
    [muiTheme.breakpoints.down("xs")]: {
      flexDirection: "column",
    },
  },
  heading: {
    [muiTheme.breakpoints.down("xs")]: {
      marginBottom: artepunktTheme.margin.headingLg,
    },
  },
}));

export default visualizationToolbarStyles;
