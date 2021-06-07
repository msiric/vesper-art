import { makeStyles } from "@material-ui/core/styles";

const imageWrapperStyles = makeStyles((muiTheme) => ({
  imageWrapperContent: {
    display: "block",
    width: "100%",
    height: "auto",
    objectFit: "contain",
    borderRadius: 4,
  },
}));

export default imageWrapperStyles;
