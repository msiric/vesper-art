import { makeStyles } from "@material-ui/core/styles";

const currencyValueStyles = makeStyles((muiTheme) => ({
  popover: {
    "&>div": {
      minWidth: "auto",
    },
  },
}));

export default currencyValueStyles;
