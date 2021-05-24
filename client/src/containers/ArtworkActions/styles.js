import { makeStyles } from "@material-ui/core/styles";

const artworkActionsStyles = makeStyles((muiTheme) => ({
  artworkActionsContainer: {},
  artworkActionsContent: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  artworkActionsCounter: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  artworkActionsIncrementer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minWidth: 58,
    height: 55,
    width: "100%",
  },
  artworkActionsFavorite: {
    marginRight: "3px",
  },
  artworkActionsFooter: {
    padding: "14px",
    width: "100%",
    display: "flex",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  artworkActionsAction: {
    width: "100%",
    display: "flex",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
}));

export default artworkActionsStyles;
