import { makeStyles } from "@material-ui/core/styles";

const promptModalStyles = makeStyles((muiTheme) => ({
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
    maxWidth: 400,
  },
  title: {
    paddingBottom: muiTheme.spacing(1),
  },
  divider: {
    marginBottom: muiTheme.spacing(1),
  },
  actions: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: muiTheme.spacing(3),
  },
}));

export default promptModalStyles;
