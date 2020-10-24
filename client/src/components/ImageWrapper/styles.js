import { makeStyles } from "@material-ui/core/styles";

const imageWrapperStyles = makeStyles((muiTheme) => ({
  imageContent: {
    display: "block",
    width: "100%",
    height: "auto",
    objectFit: "contain",
  },
}));

export default imageWrapperStyles;
