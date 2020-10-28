import { makeStyles } from "@material-ui/core/styles";

const shareModalStyles = makeStyles((muiTheme) => ({
  root: {
    width: "100%",
  },
  accordion: {
    minHeight: 80,
  },
  heading: {
    fontSize: muiTheme.typography.pxToRem(15),
    flexBasis: "33.33%",
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: muiTheme.typography.pxToRem(15),
    color: muiTheme.palette.text.secondary,
  },
}));

export default shareModalStyles;
