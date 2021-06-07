import { makeStyles } from "@material-ui/core/styles";

const imageWrapperStyles = makeStyles((muiTheme) => ({
  imageWrapperContent: {
    display: "block",
    width: "100%",
    height: "auto",
    objectFit: "contain",
    borderRadius: 4,
  },
  imageWrapperLoading: {
    position: "relative",
    width: "100%",
    display: "flex",
    justifyContent: "center",
  },
  imageWrapperCover: {
    position: "relative",
  },
}));

export default imageWrapperStyles;
