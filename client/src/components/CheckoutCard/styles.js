import { makeStyles } from "@material-ui/core/styles";

const checkoutCardStyles = makeStyles((muiTheme) => ({
  container: {
    padding: 0,
    margin: "16px 0",
  },
  media: {
    height: ({ height }) => height,
    width: ({ width }) => width,
    borderRadius: 4,
    backgroundSize: "contain",
  },
  wrapper: {
    display: "flex",
    flexDirection: "column",
  },
  text: {
    padding: "0 16px",
    margin: 0,
  },
}));

export default checkoutCardStyles;
