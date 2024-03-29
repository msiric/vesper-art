import { makeStyles } from "@material-ui/core/styles";

const listItemsStyles = makeStyles(() => ({
  item: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  box: {
    marginRight: 32,
  },
  avatar: {
    height: 24,
    width: 24,
  },
  icon: {
    fontSize: "0.7rem",
  },
  wrapper: {
    minWidth: 22,
  },
}));

export default listItemsStyles;
