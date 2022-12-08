import { makeStyles } from "@material-ui/core/styles";

const commentSectionStyles = makeStyles(() => ({
  wrapper: {
    "&:last-child": {
      paddingBottom: 0,
    },
  },
  empty: {
    height: 180,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    marginBottom: 4,
  },
}));

export default commentSectionStyles;
