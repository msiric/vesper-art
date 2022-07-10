import { makeStyles } from "@material-ui/core/styles";

const commentListStyles = makeStyles((muiTheme) => ({
  list: {
    display: "flex",
    flexDirection: "column-reverse",
    padding: 0,
    paddingBottom: 12,
  },
}));

export default commentListStyles;
