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
import axios from 'axios';
import AppStyles from './App.style';

const App = () => {
  const [store, dispatch] = useContext(Context);
  const notistackRef = createRef();

  const classes = AppStyles();

  const handleAlertClose = (key) => () => {
    notistackRef.current.closeSnackbar(key);
  };

  const getRefreshToken = async () => {
    try {
      if (!window.accessToken) {
        const { data } = await axios.post('/api/auth/refresh_token', {
          headers: {
            credentials: 'include',
          },
        });
        window.accessToken = data.accessToken;

        if (data.user) {
          dispatch({
            type: 'setStore',
            loading: false,
            error: false,
            auth: store.main.auth,
            brand: store.main.brand,
            theme: store.main.theme,
            authenticated: true,
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            photo: data.user.photo,
            messages: data.user.messages,
            notifications: data.user.notifications,
            saved: data.user.saved.reduce(function (object, item) {
              object[item] = true;
              return object;
            }, {}),
            cart: data.user.cart.reduce(function (object, item) {
              object[item.artwork] = true;
              return object;
            }, {}),
            stripeId: data.user.stripeId,
            country: data.user.country,
            cartSize: Object.keys(data.user.cart).length,
          });
        } else {
          dispatch({
            type: 'setMain',
            loading: false,
            error: false,
            auth: store.main.auth,
            brand: store.main.brand,
            theme: store.main.theme,
          });
        }
      }
    } catch (err) {
      dispatch({
        type: 'setMain',
        loading: false,
        error: true,
        auth: store.main.auth,
        brand: store.main.brand,
        theme: store.main.theme,
      });
    }
  };

  useEffect(() => {
    getRefreshToken();
  }, []);

  return !store.main.loading ? (
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
        <Router />
      </SnackbarProvider>
    </ThemeProvider>
  ) : (
    <Container fixed className={classes.fixed}>
      <Grid container className={classes.container} spacing={2}>
        <Grid item xs={12} className={classes.loader}>
          <CircularProgress />
        </Grid>
      </Grid>
    </Container>
  );
};

export default App;