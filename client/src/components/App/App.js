import React, { useState, useEffect, useContext } from 'react';
import Router from '../Router/Router';
import { Context } from '../Store/Store';
import { ThemeProvider } from '@material-ui/core/styles';
import { artepunktTheme } from '../../constants/theme';
import axios from 'axios';

export const ax = axios.create();

const App = () => {
  const [state, dispatch] = useContext(Context);
  const [loading, setLoading] = useState(true);

  const getRefreshToken = async () => {
    if (!state.user.token) {
      const { data } = await axios.post('/api/auth/refresh_token');
      dispatch({
        type: 'setToken',
        ...state,
        user: {
          ...state.user,
          token: data.accessToken,
        },
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    getRefreshToken();

    ax.interceptors.request.use(
      (request) => {
        const token = state.user.token;
        if (token) request.headers.Authorization = `Bearer ${token}`;

        return request;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    ax.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        if (error.response.status !== 401) {
          return new Promise((resolve, reject) => {
            reject(error);
          });
        }

        if (
          error.config.url === '/api/auth/refresh_token' ||
          error.response.message === 'Forbidden'
        ) {
          // log out!!!!!
          /* TokenStorage.clear();
        router.push({ name: 'root' }); */

          return new Promise((resolve, reject) => {
            reject(error);
          });
        }

        // handle error
        const { data } = await axios.post(`/api/auth/refresh_token`, {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            credentials: 'include',
          },
        });

        dispatch('setToken', {
          ...state,
          user: {
            ...state.user,
            token: data.accessToken,
          },
        });

        const config = error.config;
        config.headers['Authorization'] = `Bearer ${data.accessToken}`;

        return new Promise((resolve, reject) => {
          axios
            .request(config)
            .then((response) => {
              resolve(response);
            })
            .catch((error) => {
              reject(error);
            });
        });
      }
    );
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
