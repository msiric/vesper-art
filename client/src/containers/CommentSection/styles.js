import { makeStyles } from "@material-ui/core/styles";

const commentSectionStyles = makeStyles((muiTheme) => ({
  commentSectionList: {
    display: "flex",
    flexDirection: "column-reverse",
    padding: 0,
  },
  commentSectionEmpty: {
    height: 180,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  commentSectionHeading: {
    marginBottom: "12px",
  },
}));

export default commentSectionStyles;
