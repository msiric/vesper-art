import { makeStyles } from "@material-ui/core/styles";
import { artepunktTheme } from "./theme";

const globalStyles = makeStyles((muiTheme) => ({
  gridContainer: {
    padding: artepunktTheme.padding.containerLg,
    margin: artepunktTheme.margin.containerLg,
    [muiTheme.breakpoints.down("sm")]: {
      padding: artepunktTheme.padding.containerSm,
      margin: artepunktTheme.margin.containerSm,
    },
  },
  smallContainer: {
    maxWidth: 768,
  },
  bottomSpacing: {
    marginBottom: artepunktTheme.spacing.grid,
  },
  responsiveSpacing: {
    marginRight: 0,
    marginBottom: artepunktTheme.spacing.grid,
    [muiTheme.breakpoints.down("sm")]: {
      marginBottom: 0,
      marginRight: artepunktTheme.spacing.grid,
    },
    [muiTheme.breakpoints.down("xs")]: {
      marginRight: 0,
      marginBottom: artepunktTheme.spacing.grid,
    },
  },
  elementWidth: {
    width: "100%",
  },
  mainHeading: {
    marginBottom: 24,
  },
  "@global": {
    ".illustrationPrimary": {
      fill: artepunktTheme.palette.primary.main,
    },
    ".MuiTableCell-footer": {
      borderTop: "1px solid rgb(81, 81, 81)",
      borderBottom: "none !important",
    },
    ".MuiTableRow-root:last-of-type > .MuiTableCell-body": {
      borderBottom: "none !important",
    },
    ".MuiTableCell-body": {
      cursor: ({ hoverable }) => (hoverable ? "pointer" : "auto"),
    },
    ".MuiSelect-select:focus": {
      borderRadius: artepunktTheme.shape.borderRadius,
    },
    ".MuiTablePagination-toolbar": {
      [muiTheme.breakpoints.down("xs")]: {
        display: "flex",
        flexDirection: "column",
        padding: 0,
        marginTop: 10,
      },
    },
    ".MuiTablePagination-actions": {
      [muiTheme.breakpoints.down("xs")]: {
        marginLeft: 0,
        marginRight: 0,
      },
    },
    ".MuiTablePagination-selectRoot": {
      [muiTheme.breakpoints.down("xs")]: {
        marginLeft: "0 !important",
        marginRight: "0 !important",
      },
    },
    ".MuiTableCell-footer > div": {
      [muiTheme.breakpoints.down("xs")]: {
        justifyContent: "center",
      },
    },
    ".NoTableFooter .MuiTableBody-root>tr:nth-child(odd)": {
      background: "transparent",
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

export default globalStyles;
