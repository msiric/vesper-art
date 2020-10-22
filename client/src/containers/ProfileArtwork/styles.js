import { makeStyles } from "@material-ui/core/styles";

const profileArtworkStyles = makeStyles((muiTheme) => ({
  paper: {
    minHeight: 300,
    height: "100%",
  },
  profileArtworkContainer: {
    "&> div": {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
    },
  },
}));

export default profileArtworkStyles;