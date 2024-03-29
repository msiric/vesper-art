import { makeStyles } from "@material-ui/core/styles";
import { artepunktTheme } from "../../styles/theme";

const profileCardStyles = makeStyles(() => ({
  container: {
    height: "100%",
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
  wrapper: {
    overflow: "hidden",
    marginTop: 24,
    display: "flex",
  },
  avatar: {
    textAlign: "center",
    width: "100px",
    height: "100px",
  },
  name: {
    marginTop: 10,
    display: "block",
    textAlign: "center",
    textDecoration: "none",
    wordBreak: "break-word",
  },
  content: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  info: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "12px",
  },
  rating: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginRight: "6px",
  },
  country: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginRight: "6px",
  },
  joined: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    marginRight: 3,
  },
  description: {
    wordBreak: "break-word",
    textAlign: "center",
    width: "100%",
  },
}));

export default profileCardStyles;
