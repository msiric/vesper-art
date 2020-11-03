import { makeStyles } from "@material-ui/core/styles";
import { artepunktTheme } from "../../styles/theme";

const footerStyles = makeStyles((muiTheme) => ({
  footerContainer: {
    backgroundColor: artepunktTheme.palette.background.paper,
    width: "100%",
  },
  footerNav: {
    display: "flex",
    width: "100%",
  },
  footerItem: {
    display: "flex",
    flexDirection: "column",
    padding: "18px 0",
    [muiTheme.breakpoints.down("sm")]: {
      "&:nth-of-type(even)": {
        alignItems: "flex-end",
      },
    },
  },
  footerDisclaimers: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "18px 0",
  },
  footerCopyright: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    "& *": {
      marginLeft: 18,
      "&:first-child": {
        marginLeft: 0,
      },
    },
  },
  footerDisclosures: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    width: "100%",
    "& *": {
      marginRight: 18,
      "&:last-child": {
        marginRight: 0,
      },
    },
  },
}));

export default footerStyles;
