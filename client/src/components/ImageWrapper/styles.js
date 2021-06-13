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
  },
}));

export default imageWrapperStyles;
