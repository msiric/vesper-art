import { makeStyles } from "@material-ui/core/styles";

const galleryPanelStyles = makeStyles((muiTheme) => ({
  artworkWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    maxWidth: 500,
    height: "fit-content",
  },
  masonryContainer: {
    display: "flex",
    marginLeft: -30,
    padding: 24,
    width: "auto",
  },
  masonryColumn: {
    paddingLeft: 30,
    "&:first-child": {
      paddingLeft: 0,
    },
    backgroundClip: "padding-box",
    "&>div": {
      marginBottom: 30,
      cursor: "pointer",
      "&:hover": {
        boxShadow: "0px 0px 20px 5px rgba(0,0,0,0.75)",
      },
    },
  },
}));

export default galleryPanelStyles;
