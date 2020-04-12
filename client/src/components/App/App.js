import React, { useState, useEffect, useContext } from 'react';
import Router from '../Router/Router';
import { Context } from '../Store/Store';
import { ThemeProvider } from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core';
import { artepunktTheme } from '../../constants/theme';
import axios from 'axios';

const App = () => {
  const [store, dispatch] = useContext(Context);

  const [loading, setLoading] = useState(true);

  const getRefreshToken = async () => {
    if (!window.accessToken) {
      const { data } = await axios.post('/api/auth/refresh_token', {
        headers: {
          credentials: 'include',
        },
      });
      window.accessToken = data.accessToken;

      if (data.user) {
        dispatch({
          type: 'setUser',
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
            object[item] = true;
            return object;
          }, {}),
        });
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    getRefreshToken();
  }, []);

  return loading ? (
    <div>Loading...</div>
  ) : (
    <ThemeProvider theme={artepunktTheme}>
      <CssBaseline />
      <Router />
    </ThemeProvider>
  );
};

export default App;
