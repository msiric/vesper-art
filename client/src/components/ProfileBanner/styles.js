import { makeStyles } from "@material-ui/core/styles";
import { artepunktTheme } from "../../styles/theme.js";

const profileBannerStyles = makeStyles((muiTheme) => ({
  profileCardContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: artepunktTheme.padding.container,
  },
  profileCardName: {
    marginTop: 10,
    display: "block",
    textAlign: "center",
    textDecoration: "none",
  },
  profileCardAvatar: {
    textAlign: "center",
    width: "100px",
    height: "100px",
    borderRadius: "50%",
  },
}));

export default profileBannerStyles;
