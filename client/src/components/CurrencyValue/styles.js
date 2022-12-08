import { makeStyles } from "@material-ui/core/styles";

const currencyValueStyles = makeStyles(() => ({
  popover: {
    "&>div": {
      minWidth: "auto",
    },
  },
}));

export default currencyValueStyles;
