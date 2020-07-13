import { ax } from '../containers/Interceptor/Interceptor.js';

export const getCheckout = async ({ artworkId }) =>
  await ax.get(`/api/checkout/${artworkId}`);
export const postDiscount = async ({ data }) =>
  await ax.post('/api/discount', data);
export const deleteDiscount = async ({ discountId }) =>
  await ax.delete(`/api/discount/${discountId}`);
