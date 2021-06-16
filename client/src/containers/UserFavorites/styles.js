import { makeStyles } from "@material-ui/core/styles";

const userFavoritesStyles = makeStyles((muiTheme) => ({
  container: {
    width: "100%",
    height: "100%",
    padding: "16px 0",
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
    },
  },
}));

export default userFavoritesStyles;
