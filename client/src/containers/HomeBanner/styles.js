import { makeStyles } from "@material-ui/core/styles";
import Banner from "../../assets/images/banner/banner.jpg";
import { artepunktTheme } from "../../styles/theme";

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
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${Banner})`,
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
    [muiTheme.breakpoints.down("md")]: {
      padding: 0,
    },
  },
  beta: {
    position: "absolute",
    top: "10px",
    right: "-40px",
    transform: "rotateY(0deg) rotate(45deg)",
    background: "white",
    width: 136,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  message: {
    color: artepunktTheme.palette.primary.main,
    fontSize: 24,
  },
  bannerHeading: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    width: "60%",
    [muiTheme.breakpoints.down("md")]: {
      width: "80%",
    },
    [muiTheme.breakpoints.down("xs")]: {
      width: "100%",
    },
  },
  bannerActions: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    [muiTheme.breakpoints.down("xs")]: {
      flexDirection: "column",
    },
  },
  bannerButton: {
    margin: "0 6px",
    [muiTheme.breakpoints.down("xs")]: {
      margin: "6px",
    },
  },
  verifier: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    padding: "0 32px",
    [muiTheme.breakpoints.down("md")]: {
      padding: 0,
    },
  },
  verifierHeading: {
    fontSize: 24,
    marginBottom: 8,
    fontWeight: "bold",
    textAlign: "center",
  },
  verifierText: {
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
