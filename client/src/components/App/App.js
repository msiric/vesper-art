import React, { useState, useEffect, useContext } from 'react';
import Router from '../Router/Router';
import { Context } from '../Store/Store';
import { ThemeProvider } from '@material-ui/core/styles';
import { artepunktTheme } from '../../constants/theme';
import axios from 'axios';

const App = () => {
  const [state, dispatch] = useContext(Context);
  const [loading, setLoading] = useState(true);

  const getRefreshToken = async () => {
    if (!window.accessToken) {
      const { data } = await axios.post('/api/auth/refresh_token', {
        headers: {
          credentials: 'include',
        },
      });
      window.accessToken = data.accessToken;
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
      <Router />
    </ThemeProvider>
  );
};

export default App;
