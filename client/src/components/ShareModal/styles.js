import { makeStyles } from "@material-ui/core/styles";
import { artepunktTheme } from "../../styles/theme";

const shareModalStyles = makeStyles((muiTheme) => ({
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
    flexDirection: "column",
    marginTop: muiTheme.spacing(4),
  },
  shareContainer: {
    display: "flex",
  },
  socialButton: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    border: "1px solid !important",
    borderRadius: "50%",
    width: 48,
    height: 48,
    margin: 6,
    cursor: "pointer",
    boxSizing: "border-box",
    "& > svg": {
      "& > circle": {
        fill: "transparent",
      },
    },
    "&:hover": {
      color: `${artepunktTheme.palette.primary.main} !important`,
      "& > svg": {
        "& > path": {
          fill: `${artepunktTheme.palette.primary.main} !important`,
        },
      },
    },
  },
}));

export default shareModalStyles;
