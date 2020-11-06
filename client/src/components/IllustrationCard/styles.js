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
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    "&>svg": {
      width: "60%",
      height: "auto",
    },
  },
}));

export default illustrationCardStyles;
