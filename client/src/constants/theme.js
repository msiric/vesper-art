import {
  Card as MuiCard,
  CardContent as MuiCardContent,
  CardMedia as MuiCardMedia,
  Container as MuiContainer,
  CardActions as MuiCardActions,
  Grid as MuiGrid,
  List as MuiList,
  Paper as MuiPaper,
  Popover as MuiPopover,
  Typography as MuiTypography,
  Button as MuiButton,
  Avatar as MuiAvatar,
} from '@material-ui/core';
import { createMuiTheme, styled } from '@material-ui/core/styles';
import {
  compose,
  flexbox,
  palette,
  sizing,
  spacing,
  typography,
  borders,
} from '@material-ui/system';

export const Container = styled(MuiContainer)(compose(spacing, flexbox));
export const Grid = styled(MuiGrid)(compose(spacing, flexbox));
export const Card = styled(MuiCard)(compose(spacing, flexbox, sizing));
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
      'Poppins',
      'system-ui',
      '-apple-system',
      'BlinkMacSystemFont',
      'Segoe UI',
      'Roboto',
      'Oxygen-Sans',
      'Ubuntu',
      'Cantarell',
      'Helvetica Neue',
      'Arial',
      'sans-serif',
    ].join(','),
    fontSize: 14,
  },
  palette: {
    type: 'dark',
    primary: { main: '#d68024', alt: '#9BCECB' },
    secondary: { main: '#04b9a7', alt: '#304de6' },
    success: { main: '#028079', alt: '#08333B' },
    info: { main: '#d8dcde', alt: '#F0F2F2' },
    warning: { main: '#ffbb0f', alt: '#F79A3E' },
    error: { main: '#e25b54', alt: '#F4C0BD' },
    muted: { main: '#e9ebed', alt: '#c2c8cc' },
    light: { main: '#f8f9f9', alt: '#d8dcde' },
    dark: { main: '#2e3942', alt: '#87929e' },
    background: {
      paper: '#424242',
      default: '#303030',
    },
  },
  padding: {
    container: 20,
  },
  margin: {
    spacing: 8,
    container: 20,
  },
  props: {
    MuiButton: {
      variant: 'contained',
      color: 'primary',
    },
    MuiPaper: {
      elevation: 9,
    },
    MuiCard: {
      elevation: 6,
    },
  },
});

/* artepunktTheme.overrides.MuiTypography = {
  root: {
    '&:hover': {
      color: artepunktTheme.palette.primary.main,
    },
  },
}; */
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
artepunktTheme.overrides.MuiCardContent = {
  root: {
    '&:last-child': {
      paddingTop: 0,
      paddingLeft: 0,
      paddingRight: 0,
      paddingBottom: 0,
    },
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
