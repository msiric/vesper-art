import React, { useContext } from 'react';
import { Context } from '../../components/Store/Store';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

const ax = axios.create();

const Interceptor = () => {
  const [store, dispatch] = useContext(Context);

  const history = useHistory();

  ax.interceptors.request.use(
    (request) => {
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
        // log out
        // redirect to login

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
        messages: data.user.messages,
        notifications: data.user.notifications,
        saved: data.user.saved,
        cart: data.user.cart,
        stripeId: data.user.stripeId,
        country: data.user.country,
        cartSize: data.user.cartSize,
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

  return null;
};

export { ax };
export default Interceptor;
