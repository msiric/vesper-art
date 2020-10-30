import { makeStyles } from "@material-ui/core/styles";
import { artepunktTheme } from "../../styles/theme";

const submitButtonStyles = makeStyles((muiTheme) => ({
  buttonContainer: {
    margin: muiTheme.spacing(1),
    position: "relative",
  },
  buttonProgress: {
    color: artepunktTheme.palette.primary.main,
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
}));

export default submitButtonStyles;
