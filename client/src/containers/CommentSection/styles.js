import { makeStyles } from "@material-ui/core/styles";

const commentSectionStyles = makeStyles((muiTheme) => ({
  wrapper: {
    "&:last-child": {
      paddingBottom: 0,
    },
  },
  list: {
    display: "flex",
    flexDirection: "column-reverse",
    padding: 0,
    paddingBottom: 12,
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
