import { makeStyles } from "@material-ui/core/styles";

const likeButtonStyles = makeStyles(() => ({
  button: {
    padding: 0,
    "& svg": {
      fontSize: "1rem",
    },
  },
}));

export default likeButtonStyles;
