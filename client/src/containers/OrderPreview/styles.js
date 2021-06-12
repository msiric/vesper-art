import { makeStyles } from "@material-ui/core/styles";

const orderPreviewStyles = makeStyles((muiTheme) => ({
  wrapper: {
    display: "flex",
    justifyContent: "center",
    maxHeight: 700,
  },
  title: {
    wordBreak: "break-word",
    fontWeight: "bold",
    fontSize: 24,
  },
}));

export default orderPreviewStyles;
