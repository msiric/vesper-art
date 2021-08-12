import { makeStyles } from "@material-ui/core/styles";

const imageWrapperStyles = makeStyles((muiTheme) => ({
  media: {
    display: "block",
    width: "100%",
    height: "auto",
    objectFit: "contain",
    borderRadius: 4,
  },
  wrapper: {
    position: "relative",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    height: ({ height, loading }) => (loading ? height : "auto"),
    [muiTheme.breakpoints.down("sm")]: {
      height: ({ height, loading }) => (loading ? height / 1.25 : "auto"),
    },
    [muiTheme.breakpoints.down("xs")]: {
      height: ({ height, loading }) => (loading ? height / 2.25 : "auto"),
    },
  },
  spinner: {
    position: "absolute",
  },
  hiddenWrapper: {
    height: ({ height }) => height,
    background: ({ placeholder }) => placeholder,
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
}));

export default imageWrapperStyles;
