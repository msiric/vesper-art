import { makeStyles } from "@material-ui/core/styles";
import { artepunktTheme } from "../../styles/theme.js";

const imageInputStyles = makeStyles((muiTheme) => ({
  imageInputFile: { display: "none" },
  imageInputContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 20,
  },
  imageInputTitle: {
    margin: "auto",
    display: "flex",
    justifyContent: "center",
    padding: muiTheme.spacing(1),
  },
  imageInputAvatar: {
    cursor: "pointer",
    height: "100%",
    maxWidth: 600,
    position: "relative",
    backgroundColor: "transparent",
    "&:hover": {
      "& $overlayRemove": {
        opacity: 1,
      },
    },
  },
  imageInputPreview: {
    maxWidth: "100%",
    height: "100%",
    objectFit: "cover",
    position: "absolute",
  },
  imageInputLoading: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    height: "100%",
    width: "100%",
    opacity: 1,
    transition: ".5s ease",
    backgroundColor: artepunktTheme.palette.primary.main,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  imageInputUpload: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    height: "100%",
    width: "100%",
    opacity: 1,
    transition: ".5s ease",
    backgroundColor: artepunktTheme.palette.primary.main,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  imageInputRemove: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    height: "100%",
    width: "100%",
    opacity: 0,
    transition: ".5s ease",
    backgroundColor: artepunktTheme.palette.primary.main,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  imageInputError: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    height: "100%",
    width: "100%",
    opacity: 1,
    transition: ".5s ease",
    backgroundColor: muiTheme.palette.error.main,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  imageInputText: {
    marginTop: 3,
  },
  imageInputIcon: {
    color: "white",
  },
}));

export default imageInputStyles;
