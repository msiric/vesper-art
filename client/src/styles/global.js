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
  largeContainer: {
    maxWidth: 2600,
    width: "100%",
  },
  smallContainer: {
    maxWidth: 768,
    width: "100%",
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
    ".infinite-scroll-component__outerdiv, .infinite-scroll-component": {
      height: "100% !important",
    },
    // $TODO gadljivo
    ".VerifierTable": {
      display: "flex",
      "& thead, tbody": {
        display: "flex",
        width: "100%",
      },
      "& tr": {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        borderTop: "solid 2px rgba(0, 0, 0, 0.15) !important",
        "& th:first-child": {
          minHeight: 76,
        },
        "& td:first-child": {
          minHeight: 76,
        },
      },
      "& td, th": {
        width: "calc(100%)",
        display: "inline-block",
        fontSize: "16px",
        boxSizing: "border-box",
        border: "none",
        minHeight: 54,
        height: "100%",
      },
      [muiTheme.breakpoints.down(959.95)]: {
        "& thead": {
          display: "none",
        },
        "& td": {
          minHeight: "auto",
        },
        "& tr": {
          "& th:first-child": {
            minHeight: "auto !important",
          },
          "& td:first-child": {
            minHeight: "auto !important",
          },
        },
      },
    },
    ".MuiTableCell-root": {
      background: "transparent !important",
    },
    ".MuiTableCell-footer": {
      borderTop: "1px solid rgb(81, 81, 81)",
      borderBottom: "none !important",
    },
    ".MuiTableRow-root": {
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
    ".MuiTimelineItem-alignAlternate:nth-child(even) .MuiTimelineItem-content":
      {
        paddingLeft: 0,
        textAlign: "left",
      },
    ".MuiTimelineItem-alignAlternate:nth-child(odd) .MuiTimelineItem-content": {
      paddingRight: 0,
      textAlign: "left",
    },
    "[class*='MUIDataTableSearch-main']": {
      [muiTheme.breakpoints.down("xs")]: {
        display: "flex",
        justifyContent: "center",
      },
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
