import {
  Avatar as MuiAvatar,
  Button as MuiButton,
  Card as MuiCard,
  CardActions as MuiCardActions,
  CardContent as MuiCardContent,
  CardHeader as MuiCardHeader,
  CardMedia as MuiCardMedia,
  Container as MuiContainer,
  Grid as MuiGrid,
  List as MuiList,
  Paper as MuiPaper,
  Popover as MuiPopover,
  Typography as MuiTypography,
} from "@material-ui/core";
import { createMuiTheme, styled } from "@material-ui/core/styles";
import {
  borders,
  compose,
  flexbox,
  palette,
  sizing,
  spacing,
  typography,
} from "@material-ui/system";
import { appPalette } from "../../../common/constants";

export const Container = styled(MuiContainer)(compose(spacing, flexbox));
export const Grid = styled(MuiGrid)(compose(spacing, flexbox));
export const Card = styled(MuiCard)(compose(spacing, flexbox, sizing));
export const CardHeader = styled(MuiCardHeader)(
  compose(spacing, flexbox, sizing)
);
export const CardContent = styled(MuiCardContent)(
  compose(spacing, flexbox, sizing)
);
export const CardActions = styled(MuiCardActions)(
  compose(spacing, flexbox, sizing)
);
export const CardMedia = styled(MuiCardMedia)(
  compose(spacing, flexbox, sizing)
);
export const Paper = styled(MuiPaper)(compose(spacing, flexbox, sizing));
export const List = styled(MuiList)(compose(spacing, flexbox, sizing));
export const Popover = styled(MuiPopover)(compose(spacing, flexbox, sizing));
export const Typography = styled(MuiTypography)(
  compose(typography, spacing, palette)
);
export const Button = styled(MuiButton)(
  compose(typography, spacing, palette, sizing)
);
export const Avatar = styled(MuiAvatar)(compose(sizing, spacing, borders));

export const artepunktTheme = createMuiTheme({
  typography: {
    fontFamily: [
      "Plus Jakarta Display",
      "Poppins",
      "system-ui",
      "-apple-system",
      "BlinkMacSystemFont",
      "Segoe UI",
      "Roboto",
      "Oxygen-Sans",
      "Ubuntu",
      "Cantarell",
      "Helvetica Neue",
      "Arial",
      "sans-serif",
    ].join(","),
    fontSize: 14,
  },
  palette: { ...appPalette },
  padding: {
    containerLg: 24,
    containerSm: 12,
  },
  margin: {
    element: 2,
    containerLg: "12px auto",
    containerSm: "6px auto",
    elementLg: "16px 0",
    elementSm: "12px 0",
    headingLg: 12,
  },
  props: {
    MuiButton: {
      variant: "contained",
      color: "primary",
    },
    MuiPaper: {
      elevation: 9,
    },
    MuiCard: {
      elevation: 6,
    },
  },
  shape: { borderRadius: 20 },
});

artepunktTheme.spacing.grid = artepunktTheme.spacing.unit * 2;

artepunktTheme.overrides.MuiList = {
  padding: {
    paddingTop: 0,
    paddingBottom: 0,
  },
};

artepunktTheme.overrides.MuiToolbar = {
  gutters: {
    "@media (min-width: 600px)": {
      paddingLeft: 16,
      paddingRight: 16,
    },
  },
};

artepunktTheme.overrides.MuiDivider = {
  root: {
    width: "100%",
  },
};

artepunktTheme.overrides.MUIDataTableHeadCell = {
  contentWrapper: {
    "& > .MuiButton-textPrimary": {
      color: "white",
      "&:hover": {
        backgroundColor: "rgba(255, 255, 255, 0.08)",
      },
    },
  },
};

artepunktTheme.overrides.MUIDataTableSearch = {
  searchIcon: {
    display: "none",
  },
};

artepunktTheme.overrides.MuiPickersDateRangePickerInput = {
  root: {
    "@media (max-width: 599.95px)": {
      flexDirection: "row",
      alignItems: "baseline",
    },
  },
};

artepunktTheme.overrides.MuiCardHeader = {
  title: {
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  subheader: {
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
};

artepunktTheme.overrides.MuiFormHelperText = {
  contained: {
    marginLeft: 0,
    marginRight: 0,
  },
};

artepunktTheme.overrides.MuiCardContent = {
  root: {
    padding: 12,
  },
};

artepunktTheme.overrides.MuiCardActions = {
  root: {
    padding: 12,
  },
};

/* artepunktTheme.overrides.MuiTypography = {
  root: {
    '&:hover': {
      color: artepunktTheme.palette.primary.main,
    },
  },
}; 
artepunktTheme.overrides.MuiSnackbarContent = {
  root: {
    padding: '0 10px',
  },
};
artepunktTheme.overrides.MuiListItemText = {
  multiline: {
    width: '50%',
  },
};

artepunktTheme.overrides.MuiCardActions = {
  root: {
    padding: 0,
    justifyContent: 'center',
  },
};

artepunktTheme.overrides.MuiAccordionSummary = {
  root: {
    minHeight: 80,
  },
};

artepunktTheme.overrides.MuiFormHelperText = {
  contained: {
    marginLeft: 0,
    marginRight: 0,
  },
};
*/

artepunktTheme.overrides.MuiTableBody = {
  root: {
    wordBreak: "break-word",
    "&>tr:nth-child(odd)": {
      backgroundColor: "#3d3d3d",
    },
  },
};

// artepunktTheme.overrides.MuiTableRow = {
//   root: {
//     "&:hover": {
//       backgroundColor: "rgba(214, 128, 36, 0.5) !important",
//     },
//   },
// };

artepunktTheme.overrides.MuiSnackbarContent = {
  root: {
    minHeight: 48,
  },
  action: {
    height: 25,
  },
  message: {},
};

artepunktTheme.overrides.MuiPopover = {
  paper: {
    minWidth: 280,
  },
};

artepunktTheme.overrides.MuiListItem = {
  container: {
    width: "100%",
  },
};

artepunktTheme.overrides.MuiListItemText = {
  multiline: {
    display: "flex",
    flexDirection: "column",
  },
};

artepunktTheme.overrides.MuiInputBase = {
  root: {
    "& input": {
      "&:-webkit-autofill": {
        transition:
          "background-color 50000s ease-in-out 0s, color 50000s ease-in-out 0s, box-shadow 50000s ease-in-out 0s, color 50000s ease-in-out 0s",
      },
      "&:-webkit-autofill:focus": {
        transition:
          "background-color 50000s ease-in-out 0s, color 50000s ease-in-out 0s, box-shadow 50000s ease-in-out 0s, color 50000s ease-in-out 0s",
      },
      "&:-webkit-autofill:hover": {
        transition:
          "background-color 50000s ease-in-out 0s, color 50000s ease-in-out 0s, box-shadow 50000s ease-in-out 0s, color 50000s ease-in-out 0s",
      },
    },
  },
};

artepunktTheme.overrides.MuiButton = {
  outlined: {
    "@media (max-width: 599.95px)": {
      padding: "4px 12px !important",
    },
  },
};
