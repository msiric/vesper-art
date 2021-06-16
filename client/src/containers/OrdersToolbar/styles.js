import { makeStyles } from "@material-ui/core/styles";

const ordersToolbarStyles = makeStyles((muiTheme) => ({
  wrapper: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
  },
}));

export default ordersToolbarStyles;
