import { makeStyles } from "@material-ui/core/styles";

const checkoutStepperStyles = makeStyles((muiTheme) => ({
  wrapper: {
    width: "100%",
  },
  icon: {
    backgroundColor: "#ccc",
    zIndex: 1,
    color: "#fff",
    width: 50,
    height: 50,
    display: "flex",
    borderRadius: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  active: {
    background: muiTheme.palette.primary.main,
    boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
  },
  completed: {
    background: muiTheme.palette.primary.main,
  },
}));

export default checkoutStepperStyles;
