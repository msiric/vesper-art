import { makeStyles } from "@material-ui/core/styles";

const skeletonWrapperStyles = makeStyles((muiTheme) => ({
  skeletonWrapperContainer: {
    overflow: "hidden",
    position: "relative",
  },
  skeletonWrapperIndicator: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
}));

export default skeletonWrapperStyles;
