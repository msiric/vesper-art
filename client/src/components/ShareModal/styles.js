import { makeStyles } from "@material-ui/core/styles";
import { artepunktTheme } from "../../styles/theme";

const shareModalStyles = makeStyles((muiTheme) => ({
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
  },
  title: {
    paddingBottom: muiTheme.spacing(1),
  },
  actions: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "column",
  },
  wrapper: {
    display: "flex",
    marginTop: muiTheme.spacing(2),
    marginBottom: muiTheme.spacing(3),
  },
  button: {
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
    [muiTheme.breakpoints.down("xs")]: {
      width: 41,
      height: 41,
    },
  },
  copy: {
    width: "100%",
    height: "100%",
    padding: 10,
  },
  popper: {
    zIndex: 10000,
  },
}));

export default shareModalStyles;
