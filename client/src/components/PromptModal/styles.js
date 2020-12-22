import { makeStyles } from "@material-ui/core/styles";

const promptModalStyles = makeStyles((muiTheme) => ({
  modalWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  modalContent: {
    backgroundColor: muiTheme.palette.background.paper,
    boxShadow: muiTheme.shadows[5],
    padding: muiTheme.spacing(2),
    borderRadius: muiTheme.spacing(0.5),
  },
  modalTitle: {
    paddingBottom: muiTheme.spacing(2),
  },
  modalActions: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: muiTheme.spacing(4),
  },
}));

export default promptModalStyles;
