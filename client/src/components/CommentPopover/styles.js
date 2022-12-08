import { makeStyles } from "@material-ui/core/styles";

const commentPopoverStyles = makeStyles(() => ({
  popover: {
    "&>div": {
      minWidth: "auto",
    },
  },
}));

export default commentPopoverStyles;
