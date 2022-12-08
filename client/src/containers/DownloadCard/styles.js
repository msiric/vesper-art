import { makeStyles } from "@material-ui/core/styles";

const downloadCardStyles = makeStyles(() => ({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: 24, // $TODO Insert global padding here
    textAlign: "center",
  },
  label: {
    marginBottom: 20,
  },
}));

export default downloadCardStyles;
