import { makeStyles } from "@material-ui/core/styles";

const promptModalStyles = makeStyles((muiTheme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    backgroundColor: muiTheme.palette.background.paper,
    boxShadow: muiTheme.shadows[5],
    padding: muiTheme.spacing(2),
    borderRadius: muiTheme.shape.borderRadius,
  },
  title: {
    paddingBottom: muiTheme.spacing(2),
  },
  actions: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: muiTheme.spacing(4),
  },
}));

export default promptModalStyles;
