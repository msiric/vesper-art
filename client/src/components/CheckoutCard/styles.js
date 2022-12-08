import { makeStyles } from "@material-ui/core/styles";

const checkoutCardStyles = makeStyles(() => ({
  container: {
    padding: 0,
    margin: "16px 0",
    flexDirection: "column",
  },
  media: {
    height: ({ height }) => height,
    width: ({ width }) => width,
    borderRadius: 4,
    backgroundSize: "contain",
  },
  wrapper: {
    display: "flex",
  },
  text: {
    padding: "8px 0",
    margin: 0,
    "&>div>span": {
      display: "flex",
    },
  },
}));

export default checkoutCardStyles;
