import { makeStyles } from "@material-ui/core/styles";

const incrementCounter = makeStyles((muiTheme) => ({
  goUp: {
    display: "inline-flex",
    opacity: 0,
    transform: "translate3d(0, -20px, 0)",
    transition: "0.1s ease-in-out",
  },
  waitDown: {
    display: "inline-flex",
    opacity: 0,
    transform: "translate3d(0, 20px, 0)",
    transition: "0.1s ease-in-out",
  },
  initial: {
    display: "inline-flex",
    opacity: 1,
    transform: "translate3d(0, 0px, 0)",
    transition: "0.1s ease-in-out",
  },
}));

export default incrementCounter;
