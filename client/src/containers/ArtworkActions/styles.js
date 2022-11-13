import { makeStyles } from "@material-ui/core/styles";

const artworkActionsStyles = makeStyles((muiTheme) => ({
  container: {},
  content: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  counter: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  incrementer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minWidth: 58,
    height: 55,
    width: "100%",
  },
  icon: {
    marginLeft: "3px",
  },
  footer: {
    width: "100%",
    display: "flex",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  actions: {
    width: "100%",
    display: "flex",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
}));

export default artworkActionsStyles;
