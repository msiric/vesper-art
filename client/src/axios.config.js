import axios from 'axios';

const ax = axios.create();

ax.interceptors.request.use(
  (request) => {
    const token = window.accessToken;
    if (token) {
      request.headers.Authorization = `Bearer ${token}`;
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
      // log out!!!!!
      // TokenStorage.clear();
      // router.push({ name: 'root' });

      return new Promise((resolve, reject) => {
        reject(error);
      });
    }

    // handle error
    const { data } = await axios.post(`/api/auth/refresh_token`, {
      headers: {
        credentials: 'include',
      },
    });

    window.accessToken = data.accessToken;
    // update user info

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

export default ax;
