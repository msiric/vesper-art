import { makeStyles } from "@material-ui/core/styles";

const orderPreviewStyles = makeStyles((muiTheme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    padding: 16,
  },
  wrapper: {
    display: "flex",
    justifyContent: "center",
    height: "100%",
    maxHeight: 700,
    marginBottom: 12,
  },
  title: {
    wordBreak: "break-word",
    fontWeight: "bold",
    fontSize: 24,
  },
}));

export default orderPreviewStyles;
