import { createMuiTheme } from '@material-ui/core/styles';

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
    primary: { main: '#028079', alt: '#9BCECB' },
    secondary: { main: '#04b9a7', alt: '#304de6' },
    success: { main: '#028079', alt: '#08333B' },
    info: { main: '#d8dcde', alt: '#F0F2F2' },
    warning: { main: '#ffbb0f', alt: '#F79A3E' },
    error: { main: '#e25b54', alt: '#F4C0BD' },
    muted: { main: '#e9ebed', alt: '#c2c8cc' },
    light: { main: '#f8f9f9', alt: '#d8dcde' },
    dark: { main: '#2e3942', alt: '#87929e' },
  },
});

artepunktTheme.overrides.MuiSnackbarContent = {
  root: {
    padding: '0 10px',
  },
};

export default artepunktTheme;
