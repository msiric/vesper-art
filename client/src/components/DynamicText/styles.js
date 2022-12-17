import { makeStyles } from "@material-ui/core/styles";

const dynamicTextStyles = makeStyles(() => ({
  wrapper: {
    maxHeight: ({ height }) => height,
    width: ({ loading }) => (loading ? "auto" : "100%"),
    display: "flex",
    flexDirection: "column",
    position: "relative",

    "& > p": {
      height: "100%",
      overflow: "hidden",
    },

    "& > div": {
      position: "absolute",
      bottom: -30,
      left: 0,
      right: 0,
      marginLeft: "auto",
      marginRight: "auto",

      "& > button": {
        fontSize: "0.6rem",
      },
    },
  },

  restricted: {
    "-moz-box-shadow": "inset 0 -10px 10px -10px rgba(0,0,0,0.20)",
    "-webkit-box-shadow": "inset 0 -10px 10px -10px rgba(0,0,0,0.20)",
    boxShadow: "inset 0 -10px 10px -10px rgba(0,0,0,0.20)",
  },

  overflow: {
    marginBottom: 30,
  },
}));

export default dynamicTextStyles;
