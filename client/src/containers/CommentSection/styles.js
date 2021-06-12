import { makeStyles } from "@material-ui/core/styles";

const commentSectionStyles = makeStyles((muiTheme) => ({
  list: {
    display: "flex",
    flexDirection: "column-reverse",
    padding: 0,
  },
  empty: {
    height: 180,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    marginBottom: "12px",
  },
}));

export default commentSectionStyles;
