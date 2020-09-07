import axios from 'axios';
import React, { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import openSocket from 'socket.io-client';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner.js';
import { Context } from '../../context/Store.js';
import { postLogout } from '../../services/user.js';
const ENDPOINT = 'http://localhost:5000';

const ax = axios.create();
let socket = openSocket(ENDPOINT);

const Interceptor = ({ children }) => {
  const [store, dispatch] = useContext(Context);

  const classes = {};

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
          search: store.main.search,
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
            search: store.main.search,
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
              dataCursor: 0,
              dataCeiling: 10,
            },
            saved: data.user.saved.reduce(function (object, item) {
              object[item] = true;
              return object;
            }, {}),
            intents: data.user.intents.reduce(function (object, item) {
              object[item.artworkId] = item.intentId;
              return object;
            }, {}),
          });
        } else {
          dispatch({
            type: 'setMain',
            loading: false,
            error: false,
            auth: store.main.auth,
            brand: store.main.brand,
            theme: store.main.theme,
            search: store.main.search,
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
        search: store.main.search,
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
          await postLogout();
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
        ...store.user.notifications,
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

  return !store.main.loading ? children(socket) : <LoadingSpinner />;
};

export { ax };
export default Interceptor;
