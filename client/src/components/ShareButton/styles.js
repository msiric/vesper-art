import { makeStyles } from "@material-ui/core/styles";

const shareButtonStyles = makeStyles((muiTheme) => ({
  icon: {
    fontSize: "1.5rem",
    [muiTheme.breakpoints.down("xs")]: {
      fontSize: "1.25rem",
    },
  },
}));

export default shareButtonStyles;
