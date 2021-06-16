import { makeStyles } from "@material-ui/core/styles";

const commentPopoverStyles = makeStyles((muiTheme) => ({
  popover: {
    "&>div": {
      minWidth: "auto",
    },
  },
}));

export default commentPopoverStyles;
