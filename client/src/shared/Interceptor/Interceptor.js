import React, { useEffect, useContext } from 'react';
import { Context } from '../../components/Store/Store';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

const ax = axios.create();

const Interceptor = ({ socket, children }) => {
  const [store, dispatch] = useContext(Context);

  const history = useHistory();

  // ax.defaults.headers.common['Authorization'] = store.user.token
  //   ? `Bearer ${store.user.token}`
  //   : '';

  // useEffect(() => {
  //   socket.emit('authenticateUser', `Bearer ${store.user.token}`);
  //   socket.on('sendNotification', (data) => {
  //     dispatch({
  //       type: 'updateNotifications',
  //       count: 1,
  //     });
  //   });
  //   socket.on('expiredToken', async () => {
  //     try {
  //       const { data } = await axios.post(`/api/auth/refresh_token`, {
  //         headers: {
  //           credentials: 'include',
  //         },
  //       });
  //       dispatch({
  //         type: 'updateUser',
  //         token: data.accessToken,
  //         email: data.user.email,
  //         photo: data.user.photo,
  //         stripeId: data.user.stripeId,
  //         country: data.user.country,
  //         messages: { items: [], count: data.user.messages },
  //         notifications:
  //           store.user.notifications.items.length !== data.user.notifications
  //             ? {
  //                 ...store.user.notifications,
  //                 items: [],
  //                 count: data.user.notifications,
  //                 hasMore: true,
  //                 cursor: 0,
  //                 ceiling: 10,
  //               }
  //             : { ...store.user.notifications, count: data.user.notifications },
  //         saved: data.user.saved,
  //         cart: { items: {}, count: data.user.cart },
  //       });
  //       socket.emit('authenticateUser', `Bearer ${data.accessToken}`);
  //     } catch (err) {
  //       dispatch({
  //         type: 'resetUser',
  //       });
  //     }
  //   });
  // }, [store.user.authenticated]);

  const getRefreshToken = async () => {
    console.log('refresh token');
    try {
      console.log(1);

      if (!store.user.token) {
        dispatch({
          type: 'setMain',
          loading: true,
          error: false,
          auth: store.main.auth,
          brand: store.main.brand,
          theme: store.main.theme,
        });
        console.log(2);

        const { data } = await axios.post('/api/auth/refresh_token', {
          headers: {
            credentials: 'include',
          },
        });

        if (data.user) {
          console.log(3);
          console.log(data.accessToken);

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
            notifications:
              store.user.notifications.items.length !== data.user.notifications
                ? {
                    ...store.user.notifications,
                    items: [],
                    count: data.user.notifications,
                    hasMore: true,
                    cursor: 0,
                    ceiling: 10,
                  }
                : {
                    ...store.user.notifications,
                    count: data.user.notifications,
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
          console.log(4);

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
      console.log(5);

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

  const interceptTraffic = () => {
    ax.interceptors.request.use(
      (request) => {
        console.log('tokenIn', store.user.token, request);
        if (store.user.token) {
          request.headers.Authorization = `Bearer ${store.user.token}`;
        } else {
          request.headers.Authorization = ``;
        }
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
          const { data } = await ax.post('/api/auth/logout', {
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
          notifications:
            store.user.notifications.items.length !== data.user.notifications
              ? {
                  ...store.user.notifications,
                  items: [],
                  count: data.user.notifications,
                  hasMore: true,
                  cursor: 0,
                  ceiling: 10,
                }
              : {
                  ...store.user.notifications,
                  count: data.user.notifications,
                },
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
  };

  useEffect(() => {
    getRefreshToken();
    interceptTraffic();
  }, [store.user.token]);

  console.log('interceptor');

  return store.main.loading ? 'loading' : children;
};

export { ax };
export default Interceptor;
