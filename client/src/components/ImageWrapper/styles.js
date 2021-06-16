import { makeStyles } from "@material-ui/core/styles";

const imageWrapperStyles = makeStyles((muiTheme) => ({
  media: {
    display: "block",
    width: "100%",
    height: "auto",
    objectFit: "contain",
    borderRadius: 4,
  },
  loader: {
    position: "relative",
    width: "100%",
    display: "flex",
    justifyContent: "center",
  },
  wrapper: {
    position: "relative",
    width: "100%",
    margin: "8px 0",
  },
  spinner: {
    position: "absolute",
    display: "flex",
  },
  hiddenWrapper: {
    height: ({ height }) => height,
    background: ({ placeholder }) => placeholder,
    width: "100%",
    filter: "blur(8px)",
    margin: "8px 0",
  },
  hidden: {
    visibility: "hidden",
  },
}));

export default imageWrapperStyles;
