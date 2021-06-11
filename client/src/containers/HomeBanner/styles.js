import { makeStyles } from "@material-ui/core/styles";
import Banner from "../../assets/images/banner/banner.jpg";

const Styles = makeStyles((muiTheme) => ({
  banner: {
    height: 360,
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    position: "relative",
    zIndex: 1,
    "&::after": {
      content: '""',
      display: "block",
      position: "absolute",
      top: 0,
      left: 0,
      backgroundImage: `url(${Banner})`,
      backgroundSize: "cover",
      backgroundPosition: "center center",
      backgroundRepeat: "no-repeat",
      width: "100%",
      height: "100%",
      opacity: 0.3,
      zIndex: 0,
    },
  },
  content: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    zIndex: 1,
  },
  wrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    width: "100%",
    marginBottom: 16,
    padding: 16,
  },
  bannerHeading: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    width: "60%",
  },
  bannerActions: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  bannerButton: {
    margin: "0 6px",
  },
  verifier: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    padding: "0 32px",
  },
  verifierIcon: {
    fontSize: 56,
    marginBottom: 12,
  },
  verifierHeading: {
    textAlign: "center",
  },
  verifierButton: {
    display: "flex",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "100%",
  },
}));

export default Styles;
