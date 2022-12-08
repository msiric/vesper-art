import { makeStyles } from "@material-ui/core/styles";

const syncButtonStyles = makeStyles(() => ({
  container: {
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: ({ padding }) => `${padding}px 0`,
  },
}));

export default syncButtonStyles;
