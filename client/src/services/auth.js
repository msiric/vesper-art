import { ax } from '../../shared/Interceptor/Interceptor.js';

export const postRecover = async ({ data }) =>
  await ax.post('/api/auth/forgot_password', data);
export const postLogin = async ({ data }) =>
  await ax.post('/api/auth/login', data);
export const postReset = async ({ userId, data }) =>
  await ax.post(`/api/auth/reset_password/${userId}`, data);
export const postSignup = async ({ data }) =>
  await ax.post('/api/auth/signup', data);
export const getToken = async ({ tokenId }) =>
  await ax.get(`/api/auth/verify_token/${tokenId}`);
