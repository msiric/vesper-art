import { makeStyles } from "@material-ui/core/styles";
import { artepunktTheme } from "../../styles/theme.js";

const ModalWrapperStyles = makeStyles((muiTheme) => ({
  modalWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    padding: artepunktTheme.padding.container,
  },
}));

export default ModalWrapperStyles;
