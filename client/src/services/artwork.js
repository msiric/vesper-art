import { ax } from '../containers/Interceptor/Interceptor.js';

export const postMedia = async ({ data }) =>
  await ax.post('/api/artwork_media_upload', data);
export const postArtwork = async ({ data }) =>
  await ax.post('/api/add_artwork', data);
export const getArtwork = async ({ dataCursor, dataCeiling }) =>
  dataCursor && dataCeiling
    ? await ax.get(
        `/api/artwork?dataCursor=${dataCursor}&dataCeiling=${dataCeiling}`
      )
    : await ax.get(`/api/artwork`);
export const getDetails = async ({ artworkId, dataCursor, dataCeiling }) =>
  dataCursor && dataCeiling
    ? await ax.get(
        `/api/artwork/${artworkId}?dataCursor=${dataCursor}&dataCeiling=${dataCeiling}`
      )
    : await ax.get(`/api/artwork/${artworkId}`);
export const deleteComment = async ({ artworkId, commentId }) =>
  await ax.delete(`/api/artwork/${artworkId}/comment/${commentId}`);
export const getComments = async ({ artworkId, dataCursor, dataCeiling }) =>
  await ax.get(
    `/api/artwork/${artworkId}/comments?dataCursor=${dataCursor}&dataCeiling=${dataCeiling}`
  );
export const patchComment = async ({ artworkId, commentId, data }) =>
  await ax.patch(`/api/artwork/${artworkId}/comment/${commentId}`, data);
export const postComment = async ({ artworkId, data }) =>
  await ax.post(`/api/artwork/${artworkId}/comment`, data);
export const editArtwork = async ({ artworkId }) =>
  await ax.get(`/api/edit_artwork/${artworkId}`);
export const deleteArtwork = async ({ artworkId }) =>
  await ax.delete(`/api/edit_artwork/${artworkId}`);
export const patchArtwork = async ({ artworkId, data }) =>
  await ax.patch(`/api/edit_artwork/${artworkId}`, data);
export const getGallery = async () => await ax.get('/api/my_artwork');
export const postSave = async ({ artworkId }) =>
  await ax.post(`/api/save_artwork/${artworkId}`);
export const deleteSave = async ({ artworkId }) =>
  await ax.delete(`/api/save_artwork/${artworkId}`);
export const getSaves = async ({ userId }) =>
  await ax.get(`/api/user/${userId}/saved_artwork`);
