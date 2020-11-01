import { makeStyles } from "@material-ui/core/styles";

const ratingModalStyles = makeStyles((muiTheme) => ({
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
    maxWidth: 320,
    width: "100%",
  },
  modalTitle: {
    paddingBottom: muiTheme.spacing(2),
  },
  modalActions: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ratingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 100,
  },
}));

export default ratingModalStyles;
