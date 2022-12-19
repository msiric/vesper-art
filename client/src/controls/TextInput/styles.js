import { makeStyles } from "@material-ui/core/styles";

const textInputStyles = makeStyles(() => ({
  wrapper: {
    display: "flex",
    justifyContent: "space-between",
  },
  maxCharacters: {
    color: "rgba(255, 255, 255, 0.7)",
  },
}));

export default textInputStyles;
