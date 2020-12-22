import { makeStyles } from "@material-ui/core/styles";
import Banner from "../../assets/images/banner/banner.jpg";

const homeBannerStyles = makeStyles((muiTheme) => ({
  bannerContainer: {
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
}));

export default homeBannerStyles;
