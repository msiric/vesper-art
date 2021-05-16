import { makeStyles } from "@material-ui/core/styles";
import { artepunktTheme } from "../../styles/theme";

const profileCardStyles = makeStyles((muiTheme) => ({
  profileCardContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: artepunktTheme.padding.container,
    minWidth: 200,
    textDecoration: "none",
    position: "relative",
  },
  profileCardName: {
    marginTop: 10,
    display: "block",
    textAlign: "center",
    textDecoration: "none",
    wordBreak: "break-word",
  },
  profileCardWrapper: {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    overflow: "hidden",
    marginTop: 24,
  },
  profileCardAvatar: {
    textAlign: "center",
    width: "100%",
    height: "100%",
  },
  profileCardDescription: {
    wordBreak: "break-word",
  },
}));

export default profileCardStyles;
