import { makeStyles } from "@material-ui/core/styles";

const emptySectionStyles = makeStyles(() => ({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    maxWidth: "100%",
    position: "relative",
    minHeight: ({ height }) => (height !== undefined ? height : "100%"),
  },
  wrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "100%",
    padding: "32px 0",
    cursor: "default",
    flexDirection: "column",
    top: "50%",
    left: "50%",
    transform: ({ height }) => (height ? "translate(-50%, -50%)" : "none"),
    position: ({ height }) => (height ? "absolute" : "static"),
  },
  icon: {
    fontSize: 56,
    marginBottom: 20,
  },
  label: {
    textTransform: "none",
    textAlign: "center",
  },
}));

export default emptySectionStyles;
