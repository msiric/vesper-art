import { makeStyles } from "@material-ui/core/styles";
import { artepunktTheme } from "../../styles/theme.js";

const EditFormStyles = makeStyles((muiTheme) => ({
  editUserContainer: {
    padding: artepunktTheme.padding.container,
  },
}));

export default EditFormStyles;
