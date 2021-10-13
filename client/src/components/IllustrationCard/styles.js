import { makeStyles } from "@material-ui/core/styles";

const illustrationCardStyles = makeStyles((muiTheme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    margin: "128px 0",
  },
  wrapper: {
    display: "flex",
    flexDirection: "column",
    textAlign: "center",
    width: "70%",
  },
  reverse: {
    flexDirection: "column-reverse",
  },
  label: {
    margin: "0 auto",
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
  heading: {
    fontWeight: "bold",
    marginLeft: 8,
    marginBottom: 8,
    fontSize: 24,
  },
  paragraph: {
    marginLeft: 8,
  },
}));

export default illustrationCardStyles;
