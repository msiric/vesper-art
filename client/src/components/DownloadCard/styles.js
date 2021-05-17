import { makeStyles } from "@material-ui/core/styles";

const downloadCardStyles = makeStyles((muiTheme) => ({
  downloadCardWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: 24, // $TODO insert global padding here
    textAlign: "center",
  },
  downloadCardLabel: {
    marginBottom: 20,
  },
}));

export default downloadCardStyles;
