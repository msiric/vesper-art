import { ax } from '../shared/Interceptor/Interceptor.js';

export const postVerifier = async ({ data }) =>
  await ax.post('/api/verifier', data);
export const getSearch = async ({ query, cursor, ceiling }) =>
  await ax.get(`/api/search${query}&cursor=${cursor}&ceiling=${ceiling}`);
