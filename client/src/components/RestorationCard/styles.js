import { makeStyles } from "@material-ui/core/styles";

const restorationCardStyles = makeStyles((muiTheme) => ({
  container: {
    background: "transparent",
    boxShadow: "none",
    border: "1px solid",
    margin: "12px 0",
    [muiTheme.breakpoints.down("xs")]: {
      margin: "12px 15%",
    },
    [muiTheme.breakpoints.down(450)]: {
      margin: "12px 0",
    },
  },
  wrapper: {
    padding: 12,
  },
  illustration: {
    width: "55%",
    paddingBottom: "55%",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    background: "#d3d3d3",
    margin: "0 auto 16px auto",
    "&>svg": {
      position: "absolute",
      left: "50%",
      top: "50%",
      transform: "translate(-50%,-50%)",
      width: "80%",
      height: "auto",
    },
  },
  content: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    padding: "0 10px",
    "&>h2": {
      fontWeight: "bold",
    },
  },
}));

export default restorationCardStyles;
