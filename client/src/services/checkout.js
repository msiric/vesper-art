import { ax } from '../containers/Interceptor/Interceptor.js';

export const getCheckout = async ({ versionId }) =>
  await ax.get(`/api/checkout/${versionId}`);
export const postDiscount = async ({ data }) =>
  await ax.post('/api/discount', data);
export const deleteDiscount = async ({ discountId }) =>
  await ax.delete(`/api/discount/${discountId}`);
export const postDownload = async ({ versionId, data }) =>
  await ax.post(`/api/download/${versionId}`, data);
