import { makeStyles } from "@material-ui/core/styles";

const galleryPanelStyles = makeStyles((muiTheme) => ({
  container: {
    padding: "16px 0",
  },
  card: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    maxWidth: 500,
    height: "fit-content",
  },
  masonry: {
    display: "flex",
    width: "auto",
  },
  column: {
    paddingLeft: 24,
    "&:first-child": {
      paddingLeft: 0,
    },
    backgroundClip: "padding-box",
    "&>div": {
      marginBottom: 24,
      cursor: "pointer",
      "&:hover": {
        boxShadow: "0px 0px 20px 5px rgba(0,0,0,0.75)",
      },
    },
  },
}));

export default galleryPanelStyles;
