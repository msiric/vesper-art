import { makeStyles } from "@material-ui/core/styles";

const searchPanelStyles = makeStyles(() => ({
  container: {
    width: "100%",
    height: "100%",
    padding: "16px 0",
    minHeight: 500,
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

export default searchPanelStyles;
