import { makeStyles } from "@material-ui/core/styles";

const ratingModalStyles = makeStyles((muiTheme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    backgroundColor: muiTheme.palette.background.paper,
    boxShadow: muiTheme.shadows[5],
    padding: muiTheme.spacing(2),
    borderRadius: muiTheme.spacing(0.5),
    maxWidth: 320,
    width: "100%",
  },
  title: {
    paddingBottom: muiTheme.spacing(2),
  },
  actions: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
}));

export default ratingModalStyles;
