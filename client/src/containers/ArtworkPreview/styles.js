import { makeStyles } from "@material-ui/core/styles";

const artworkPreviewStyles = makeStyles((muiTheme) => ({
  container: {
    width: "100%",
    backgroundColor: muiTheme.palette.background.paper,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: 16,
  },
  imageWrapper: {
    display: "flex",
    justifyContent: "center",
    maxHeight: 700,
  },
  title: {
    marginTop: 8,
    fontSize: 24,
    fontWeight: "bold",
    wordBreak: "break-word",
  },
  description: {
    wordBreak: "break-word",
    marginBottom: 8,
  },
  disclaimerWrapper: {
    margin: "8px 0 0 0",
  },
  disclaimer: {
    fontSize: 12,
    fontStyle: "italic",
  },
}));

export default artworkPreviewStyles;
