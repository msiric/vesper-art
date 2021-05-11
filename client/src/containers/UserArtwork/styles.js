import { makeStyles } from "@material-ui/core/styles";

const userArtworkStyles = makeStyles((muiTheme) => ({
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
    width: "auto",
  },
  masonryColumn: {
    paddingLeft: 24,
    "&:first-child": {
      paddingLeft: 0,
    },
    backgroundClip: "padding-box",
    "&>div": {
      marginBottom: 24,
    },
  },
}));

export default userArtworkStyles;
