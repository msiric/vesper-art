import { makeStyles } from "@material-ui/core/styles";

const settingsProfileStyles = makeStyles(() => ({
  container: {
    height: "100%",
  },
  form: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    flexGrow: 1,
    "&>div": {
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      flexGrow: 1,
    },
  },
  actions: {
    display: "flex",
  },
}));

export default settingsProfileStyles;
