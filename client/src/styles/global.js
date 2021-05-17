import { makeStyles } from "@material-ui/core/styles";
import { artepunktTheme } from "./theme.js";

const GlobalStyles = makeStyles((muiTheme) => ({
  gridContainer: {
    padding: artepunktTheme.padding.containerLg,
    margin: artepunktTheme.margin.containerLg,
    [muiTheme.breakpoints.down("sm")]: {
      padding: artepunktTheme.padding.containerSm,
      margin: artepunktTheme.margin.containerSm,
    },
  },
  bottomSpacing: {
    marginBottom: artepunktTheme.spacing.grid,
  },
  rightSpacing: {
    marginRight: artepunktTheme.spacing.grid,
  },
  elementSpacing: {
    margin: artepunktTheme.margin.elementLg,
    [muiTheme.breakpoints.down("sm")]: {
      margin: artepunktTheme.margin.elementSm,
    },
  },
  elementWidth: {
    width: "100%",
  },
  mainHeading: {
    marginBottom: 24,
  },
  dropdownOption: {
    [muiTheme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
  "@global": {
    ".illustrationPrimary": {
      fill: artepunktTheme.palette.primary.main,
    },
    ".SRLElementWrapper": {
      opacity: ({ fetching }) => (fetching ? "0.3 !important" : "1 !important"),
      "&:last-of-type": {
        "&::after": {
          display: ({ fetching }) => (fetching ? "block" : "none"),
          content: '""',
          position: "absolute",
          top: "50%",
          left: "50%",
          marginTop: -30,
          marginLeft: -30,
          width: 50,
          height: 50,
          borderRadius: 50,
          border: `5px solid ${artepunktTheme.palette.primary.main}`,
          borderTopColor: "black",
          animation: `$loading 2s linear infinite`,
          zIndex: 10000,
        },
      },
    },
    ".MuiTableCell-body": {
      cursor: ({ hoverable }) => (hoverable ? "pointer" : "auto"),
    },
    "@keyframes loading": {
      "0%": {
        transform: "rotate(0deg)",
      },
      "100%": {
        transform: "rotate(360deg)",
      },
    },
  },
}));

export default GlobalStyles;
