import React, { useEffect, useContext, createRef } from 'react';
import Router from '../Router/Router';
import { Context } from '../Store/Store';
import { ThemeProvider } from '@material-ui/core/styles';
import {
  CssBaseline,
  IconButton,
  Container,
  Grid,
  CircularProgress,
} from '@material-ui/core';
import { CloseRounded as CloseIcon } from '@material-ui/icons';
import { SnackbarProvider } from 'notistack';
import { artepunktTheme } from '../../constants/theme';
import AppStyles from './App.style';

const App = ({ socket }) => {
  const [store, dispatch] = useContext(Context);
  const notistackRef = createRef();

  const classes = AppStyles();

  const handleAlertClose = (key) => () => {
    notistackRef.current.closeSnackbar(key);
  };

  return (
    <ThemeProvider
      theme={{
        ...artepunktTheme,
        palette: { ...artepunktTheme.palette, type: store.main.theme },
      }}
    >
      <SnackbarProvider
        classes={{
          containerAnchorOriginTopCenter: classes.alert,
        }}
        dense
        maxSnack={3}
        preventDuplicate
        ref={notistackRef}
        action={(key) => (
          <IconButton
            color="inherit"
            aria-label="Close"
            className={classes.close}
            onClick={handleAlertClose(key)}
          >
            <CloseIcon />
          </IconButton>
        )}
      >
        <CssBaseline />
        <Router socket={socket} />
      </SnackbarProvider>
    </ThemeProvider>
  );
};

export default App;
