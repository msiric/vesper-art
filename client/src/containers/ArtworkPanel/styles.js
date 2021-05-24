import { makeStyles } from "@material-ui/core/styles";

const artworkPanelStyles = makeStyles((muiTheme) => ({
  artworkPanelContainer: {
    width: "100%",
    height: "100%",
    padding: "16px 0",
  },
  artworkPanelMasonry: {
    display: "flex",
    width: "auto",
  },
  artworkPanelColumn: {
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

export default artworkPanelStyles;
