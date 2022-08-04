import { makeStyles } from "@material-ui/core/styles";

const infiniteListStyles = makeStyles((muiTheme) => ({
  container: {
    overflow: ({ overflow }) => overflow,
  },
  spinner: {
    margin: "12px 0",
  },
  error: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: ({ dataLength, emptyHeight }) =>
      dataLength ? "auto" : emptyHeight,
    margin: ({ dataLength }) => (dataLength ? "16px 0" : "0"),
  },
  label: {
    marginBottom: 16,
  },
}));

export default infiniteListStyles;
