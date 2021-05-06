import { makeStyles } from "@material-ui/core/styles";

const skeletonWrapperStyles = makeStyles((muiTheme) => ({
  skeletonWrapperContainer: {
    overflow: "hidden",
    width: "100%",
    height: "100%",
  },
  skeletonWrapperIndicator: {
    width: "100%",
    height: "100%",
  },
}));

export default skeletonWrapperStyles;
