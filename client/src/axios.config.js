import store from 'store';
import axios from 'axios';

const instance = axios.create();

instance.interceptors.request.use(
  (request) => {
    const token = store.get('jwt.token');
    if (token) request.headers.Authorization = `Bearer ${token}`;

    return request;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
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

    store.set('jwt.token', data.accessToken);

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

export default instance;
