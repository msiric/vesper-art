import { makeStyles } from "@material-ui/core/styles";
import { artepunktTheme } from "../../styles/theme";

const imageInputStyles = makeStyles((muiTheme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 20,
  },
  file: { display: "none" },
  title: {
    margin: "auto",
    display: "flex",
    justifyContent: "center",
    padding: muiTheme.spacing(1),
  },
  avatar: {
    cursor: ({ editable }) => (editable ? "pointer" : "auto"),
    height: 150,
    width: 150,
    maxWidth: 600,
    position: "relative",
    backgroundColor: "transparent",
    margin: "auto",
    borderColor: artepunktTheme.palette.primary.main,
    "&:hover": {
      "& $overlayRemove": {
        opacity: 1,
      },
    },
  },
  artwork: {
    height: "100%",
    width: "100%",
  },
  sizing: {
    paddingTop: "70%",
  },
  minHeight: {
    minHeight: 400,
    [muiTheme.breakpoints.down("xs")]: {
      minHeight: 250,
    },
  },
  preview: {
    maxWidth: 750,
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  artworkPreview: {
    objectFit: "contain",
  },
  input: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    transition: ".5s ease",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  loading: {
    height: 150,
    width: 150,
    opacity: 1,
    backgroundColor: artepunktTheme.palette.primary.main,
  },
  upload: {
    height: "100%",
    width: "100%",
    opacity: 1,
    backgroundColor: artepunktTheme.palette.primary.main,
  },
  remove: {
    height: "100%",
    width: "100%",
    opacity: 0,
    backgroundColor: artepunktTheme.palette.primary.main,
  },
  error: {
    height: "100%",
    width: "100%",
    opacity: 1,
    backgroundColor: muiTheme.palette.error.main,
  },
  helper: {
    marginTop: 3,
    textAlign: "center",
  },
  icon: {
    color: "white",
  },
  hidden: {
    display: "none",
  },
}));

export default imageInputStyles;
