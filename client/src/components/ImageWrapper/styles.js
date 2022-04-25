import { makeStyles } from "@material-ui/core/styles";

const imageWrapperStyles = makeStyles((muiTheme) => ({
  media: {
    display: "block",
    width: "100%",
    height: "100%",
    objectFit: "contain",
    borderRadius: 4,
    zIndex: 10,
  },
  wrapper: {
    position: "relative",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    overflow: "hidden",
    padding: 20,
    borderRadius: muiTheme.shape.borderRadius,
    height: ({ height, loading }) => (loading ? height : "auto"),
    [muiTheme.breakpoints.down("sm")]: {
      height: ({ height, loading }) => (loading ? height / 1.25 : "auto"),
    },
    [muiTheme.breakpoints.down("xs")]: {
      height: ({ height, loading }) => (loading ? height / 2.25 : "auto"),
    },
  },
  hiddenWrapper: {
    background: ({ placeholder }) => placeholder,
    height: "100%",
    width: "100%",
    filter: "blur(8px)",
  },
  hidden: {
    visibility: "hidden",
  },
  opacity: {
    opacity: 0.5,
  },
  overlay: {
    "&::after": {
      content: '""',
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      zIndex: 99,
    },
  },
  coverParent: {
    objectFit: "cover",
  },
  blur: {
    backgroundImage: ({ source }) => `url(${source})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "100% 100%",
    filter: "blur(90px)",
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
  },
}));

export default imageWrapperStyles;
