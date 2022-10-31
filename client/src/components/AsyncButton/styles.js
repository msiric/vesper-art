import { makeStyles } from "@material-ui/core/styles";

const asyncButtonStyles = makeStyles((muiTheme) => ({
  container: {
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: ({ padding }) => `${padding}px 0`,
  },
  progress: {
    position: "absolute",
  },
}));

export default asyncButtonStyles;
