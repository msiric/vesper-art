import React, { useEffect, useContext } from 'react';
import { Container, Grid, CircularProgress } from '@material-ui/core';
import { Context } from '../../components/Store/Store';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import InterceptorStyles from './Interceptor.style';
import openSocket from 'socket.io-client';
const ENDPOINT = 'http://localhost:5000';

const ax = axios.create();
let socket = openSocket(ENDPOINT);

const Interceptor = ({ children }) => {
  const [store, dispatch] = useContext(Context);

  const classes = InterceptorStyles();

  const history = useHistory();

  const getRefreshToken = async () => {
    try {
      if (!store.user.token) {
        dispatch({
          type: 'setMain',
          loading: true,
          error: false,
          auth: store.main.auth,
          brand: store.main.brand,
          theme: store.main.theme,
        });

        const { data } = await axios.post('/api/auth/refresh_token', {
          headers: {
            credentials: 'include',
          },
        });

        if (data.user) {
          dispatch({
            type: 'setStore',
            loading: false,
            error: false,
            auth: store.main.auth,
            brand: store.main.brand,
            theme: store.main.theme,
            authenticated: true,
            token: data.accessToken,
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            photo: data.user.photo,
            stripeId: data.user.stripeId,
            country: data.user.country,
            messages: {
              items: [],
              count: data.user.messages,
            },
            notifications: {
              ...store.user.notifications,
              items: [],
              count: data.user.notifications,
              hasMore: true,
              cursor: 0,
              ceiling: 10,
            },
            saved: data.user.saved.reduce(function (object, item) {
              object[item] = true;
              return object;
            }, {}),
            cart: {
              items: data.user.cart.reduce(function (object, item) {
                object[item.artwork] = true;
                return object;
              }, {}),
              count: Object.keys(data.user.cart).length,
            },
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

  const interceptTraffic = (token) => {
    if (token) {
      ax.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete ax.defaults.headers.common['Authorization'];
    }

    ax.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        console.log(error);
        if (error.response.status !== 401) {
          return new Promise((resolve, reject) => {
            reject(error);
          });
        }

        if (
          error.config.url === '/api/auth/refresh_token' ||
          error.response.message === 'Forbidden'
        ) {
          await ax.post('/api/auth/logout', {
            headers: {
              credentials: 'include',
            },
          });
          dispatch({
            type: 'resetUser',
          });
          history.push('/login');

          return new Promise((resolve, reject) => {
            reject(error);
          });
        }

        const { data } = await axios.post('/api/auth/refresh_token', {
          headers: {
            credentials: 'include',
          },
        });

        console.log(
          store.user.notifications.items.length,
          data.user.notifications
        );

        dispatch({
          type: 'updateUser',
          token: data.accessToken,
          email: data.user.email,
          photo: data.user.photo,
          stripeId: data.user.stripeId,
          country: data.user.country,
          messages: { items: [], count: data.user.messages },
          notifications: { count: data.user.notifications },
          saved: data.user.saved,
          cart: { items: {}, count: data.user.cart },
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

    handleSocket(token);
  };

  const handleSocket = (token) => {
    console.log('emit');
    socket = openSocket(ENDPOINT);

    socket.emit('authenticateUser', token ? `Bearer ${token}` : null);
    socket.on('sendNotification', () => {
      dispatch({
        type: 'updateNotifications',
        count: 1,
      });
    });
    socket.on('expiredToken', async () => {
      try {
        const { data } = await axios.post(`/api/auth/refresh_token`, {
          headers: {
            credentials: 'include',
          },
        });
        dispatch({
          type: 'updateUser',
          token: data.accessToken,
          email: data.user.email,
          photo: data.user.photo,
          stripeId: data.user.stripeId,
          country: data.user.country,
          messages: { items: [], count: data.user.messages },
          notifications: { count: data.user.notifications },
          saved: data.user.saved,
          cart: { items: {}, count: data.user.cart },
        });
        socket.emit('authenticateUser', `Bearer ${data.accessToken}`);
      } catch (err) {
        dispatch({
          type: 'resetUser',
        });
      }
    });
  };

  useEffect(() => {
    getRefreshToken();
  }, []);

  useEffect(() => {
    if (!store.main.loading) interceptTraffic(store.user.token);
  }, [store.user.token]);

  return !store.main.loading ? (
    children(socket)
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

export { ax };
export default Interceptor;
