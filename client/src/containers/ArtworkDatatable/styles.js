import { makeStyles } from "@material-ui/core/styles";

const artworkDatatableStyles = makeStyles((muiTheme) => ({
  artwork: {
    "&>div:nth-of-type(2)": {
      maxWidth: "200px",
      [muiTheme.breakpoints.up("md")]: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        maxWidth: "100px",
      },
    },
  },
  wrapper: {
    display: "flex",
  },
  button: {
    padding: 6,
  },
}));

export default artworkDatatableStyles;
