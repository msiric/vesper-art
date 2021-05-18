import { makeStyles } from "@material-ui/core/styles";

const searchPanelStyles = makeStyles((muiTheme) => ({
  searchPanelContainer: {
    width: "100%",
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

export default searchPanelStyles;
