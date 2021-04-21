import { makeStyles } from "@material-ui/core/styles";

const userFavoritesStyles = makeStyles((muiTheme) => ({
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
    paddingLeft: 30,
    "&:first-child": {
      paddingLeft: 0,
    },
    backgroundClip: "padding-box",
    "&>div": {
      marginBottom: 30,
    },
  },
}));

export default userFavoritesStyles;
