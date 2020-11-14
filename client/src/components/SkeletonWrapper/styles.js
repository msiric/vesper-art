import { makeStyles } from "@material-ui/core/styles";

const skeletonWrapperStyles = makeStyles((muiTheme) => ({
  skeletonWrapperContainer: {
    overflow: "hidden",
  },
  skeletonWrapperIndicator: {
    width: "100%",
    height: "100%",
  },
}));

export default skeletonWrapperStyles;
