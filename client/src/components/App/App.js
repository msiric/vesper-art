import React from 'react';
import Store from '../Store/Store';
import Router from '../Router/Router';
import { ThemeProvider } from '@material-ui/core/styles';
import { artepunktTheme } from '../../constants/theme';

const App = () => {
  return (
    <Store>
      <ThemeProvider theme={artepunktTheme}>
        <Router />
      </ThemeProvider>
    </Store>
  );
};

export default App;
