import { makeStyles } from "@material-ui/core/styles";

const artworkPanelStyles = makeStyles((muiTheme) => ({
  artworkWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    maxWidth: 500,
    height: "fit-content",
    padding: 12,
  },
  masonryContainer: {
    display: "flex",
    marginLeft: -30,
    padding: "0 30px",
    width: "auto",
  },
  masonryColumn: {
    paddingLeft: 30,
    backgroundClip: "padding-box",
    "&>div": {
      marginBottom: 30,
    },
  },
}));

export default artworkPanelStyles;
