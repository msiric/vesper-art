import { makeStyles } from "@material-ui/core/styles";
import { artepunktTheme } from "../../styles/theme";

const footerStyles = makeStyles((muiTheme) => ({
  container: {
    backgroundColor: artepunktTheme.palette.background.paper,
    width: "100%",
  },
  footer: {
    padding: "0 24px",
    [muiTheme.breakpoints.down("sm")]: {
      padding: "0 12px",
    },
  },
  navigation: {
    display: "flex",
    width: "100%",
  },
  item: {
    display: "flex",
    flexDirection: "column",
    padding: "18px 0",
    flex: "0 0 25%",
    [muiTheme.breakpoints.down("sm")]: {
      flex: "0 0 33.3333%",
    },
    [muiTheme.breakpoints.down("xs")]: {
      flex: "0 0 50%",
    },
  },
  link: {
    textDecoration: "initial",
    color: "#fff",
  },
  disclaimers: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: 75,
  },
  copyright: {
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
    [muiTheme.breakpoints.down("sm")]: {
      justifyContent: "center",
    },
  },
  logo: {
    width: 100,
    cursor: "pointer",
  },
  disclosures: {
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
    [muiTheme.breakpoints.down("sm")]: {
      justifyContent: "center",
    },
  },
  button: {
    color: "white",
    padding: 0,
    margin: "8px 16px 8px 0",
    "&:last-child": {
      margin: "8px 0",
    },
  },
}));

export default footerStyles;
