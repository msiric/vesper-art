import { makeStyles } from "@material-ui/core/styles";

const orderPreviewStyles = makeStyles((muiTheme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    padding: 12,
  },
  previewWrapper: {
    display: "flex",
    justifyContent: "center",
    height: "100%",
    maxHeight: 700,
    marginBottom: 12,
  },
  detailsWrapper: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  title: {
    wordBreak: "break-word",
    fontWeight: "bold",
    fontSize: 24,
    color: "#fff",
    textDecoration: "none",
  },
}));

export default orderPreviewStyles;
