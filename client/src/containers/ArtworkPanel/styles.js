import { makeStyles } from "@material-ui/core/styles";

const artworkPanelStyles = makeStyles((muiTheme) => ({
  container: {
    width: "100%",
    height: "100%",
    padding: 0,
  },
  masonry: {
    display: "flex",
    width: "auto",
  },
  column: {
    display: "flex",
    flexDirection: "column",
    paddingLeft: 16,
    "&:first-child": {
      paddingLeft: 0,
    },
    backgroundClip: "padding-box",
    "&>div": {
      marginBottom: 16,
    },
  },
}));

export default artworkPanelStyles;
