import { makeStyles } from "@material-ui/core/styles";

const ratingModalStyles = makeStyles((muiTheme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 12px",
  },
  content: {
    backgroundColor: muiTheme.palette.background.paper,
    boxShadow: muiTheme.shadows[5],
    padding: muiTheme.spacing(2),
    borderRadius: muiTheme.shape.borderRadius,
    maxWidth: 320,
    width: "100%",
  },
  rating: {
    marginTop: muiTheme.spacing(2),
    marginBottom: muiTheme.spacing(3),
  },
  title: {
    paddingBottom: muiTheme.spacing(1),
  },
  actions: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
}));

export default ratingModalStyles;
