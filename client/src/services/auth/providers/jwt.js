import store from 'store';
import axios from 'axios';

export async function JWT_login(email, password) {
  const user = {
    email,
    password,
  };
  const token = mainStoreget('jwt.token');

  const { data } = await axios.post(`/api/auth/login`, JSON.stringify(user), {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      credentials: 'include',
      Authorization: token ? `Bearer ${token}` : '',
    },
  });
  mainStoreset('jwt.token', data.accessToken);
  return true;
}

export async function JWT_refreshToken() {
  const { data } = await axios.post(`/api/auth/refresh_token`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      credentials: 'include',
    },
  });

  return { accessToken: data.accessToken };
}

export async function JWT_logout() {
  const { data } = await axios.post(`/api/auth/logout`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      credentials: 'include',
    },
  });
  mainStoreremove('jwt.token');
  return true;
}
