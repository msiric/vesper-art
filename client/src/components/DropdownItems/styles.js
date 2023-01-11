import { makeStyles } from "@material-ui/core/styles";

const dropdownItemsStyles = makeStyles((muiTheme) => ({
  dropdown: {
    borderRadius: muiTheme.shape.borderRadius,
  },
}));

export default dropdownItemsStyles;
