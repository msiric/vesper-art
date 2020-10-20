import { makeStyles } from "@material-ui/core/styles";

const orderPreviewStyles = makeStyles((muiTheme) => ({
  fixed: {
    height: "100%",
  },
  container: {
    flex: 1,
    height: "100%",
  },
  loader: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  artworkPreviewItem: {
    display: "flex",
    alignItems: "center",
    flex: 1,
    flexDirection: "column",
  },
  paper: {
    height: "100%",
    width: "100%",
    padding: muiTheme.spacing(2),
    boxSizing: "border-box",
    textAlign: "center",
    color: muiTheme.palette.text.secondary,
  },
  artworkPreviewMedia: {
    height: 500,
    backgroundSize: "contain",
  },
  avatar: {
    width: muiTheme.spacing(10),
    height: muiTheme.spacing(10),
    margin: muiTheme.spacing(2),
    borderRadius: "50%",
    flexShrink: 0,
    backgroundColor: muiTheme.palette.background.default,
  },
  artworkPreviewCard: {
    width: "100%",
    backgroundColor: muiTheme.palette.background.paper,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  user: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  fonts: {
    fontWeight: "bold",
  },
  inline: {
    display: "inline",
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  license: {
    textTransform: "capitalize",
  },
  postComment: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  editComment: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
  },
  editCommentForm: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    flexDirection: "row",
  },
  editCommentActions: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    flexDirection: "row",
  },
  modified: {
    fontSize: 14,
    fontWeight: "normal",
  },
  noLink: {
    textDecoration: "none",
    color: "inherit",
  },
  moreOptions: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
}));

export default orderPreviewStyles;
