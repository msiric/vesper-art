import { ax } from '../containers/Interceptor/Interceptor.js';

export const postVerifier = async ({ data }) =>
  await ax.post('/api/verifier', data);
export const getSearch = async ({ searchQuery, dataCursor, dataCeiling }) =>
  await ax.get(
    `/api/search${searchQuery}&dataCursor=${dataCursor}&dataCeiling=${dataCeiling}`
  );
