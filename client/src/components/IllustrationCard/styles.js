import { makeStyles } from "@material-ui/core/styles";

const illustrationCardStyles = makeStyles((muiTheme) => ({
  illustrationContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    margin: "128px 0",
  },
  illustrationWrapper: {
    width: "70%",
    paddingBottom: "70%",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    background: "#d3d3d3",
    "&>svg": {
      position: "absolute",
      left: "50%",
      top: "50%",
      transform: "translate(-50%,-50%)",
      width: "80%",
      height: "auto",
    },
  },
}));

export default illustrationCardStyles;
