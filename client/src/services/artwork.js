import { ax } from "../containers/Interceptor/Interceptor.js";

export const postMedia = {
  request: async ({ data }) => await ax.post("/api/artwork_media_upload", data),
  success: { message: "Cover successfully uploaded", variant: "success" },
  error: { message: "Failed to upload cover", variant: "error" },
};
export const postArtwork = {
  request: async ({ data }) => await ax.post("/api/add_artwork", data),
  success: { message: "Artwork successfully published", variant: "success" },
  error: { message: "Failed to publish artwork", variant: "error" },
};
export const getArtwork = {
  request: async (_, { dataCursor = null, dataCeiling = null }) =>
    typeof dataCursor !== null && typeof dataCeiling !== null
      ? await ax.get(
          `/api/artwork?dataCursor=${dataCursor}&dataCeiling=${dataCeiling}`
        )
      : await ax.get(`/api/artwork`),
  success: { message: "Artwork successfully fetched", variant: "success" },
  error: { message: "Failed to fetch artwork", variant: "error" },
};
export const getDetails = {
  request: async (_, { artworkId, dataCursor = null, dataCeiling = null }) =>
    typeof dataCursor !== null && typeof dataCeiling !== null
      ? await ax.get(
          `/api/artwork/${artworkId}?dataCursor=${dataCursor}&dataCeiling=${dataCeiling}`
        )
      : await ax.get(`/api/artwork/${artworkId}`),
  success: { message: "Artwork successfully fetched", variant: "success" },
  error: { message: "Failed to fetch artwork", variant: "error" },
};
export const getComment = {
  request: async (_, { artworkId, commentId }) =>
    await ax.get(`/api/artwork/${artworkId}/comment/${commentId}`),
  success: { message: "Comment successfully fetched", variant: "success" },
  error: { message: "Failed to fetch comment", variant: "error" },
};
export const deleteComment = {
  request: async ({ artworkId, commentId }) =>
    await ax.delete(`/api/artwork/${artworkId}/comment/${commentId}`),
  success: { message: "Comment successfully deleted", variant: "success" },
  error: { message: "Failed to delete comment", variant: "error" },
};
// $TODO Not used?
export const getComments = {
  request: async (_, { artworkId, dataCursor = null, dataCeiling = null }) =>
    await ax.get(
      `/api/artwork/${artworkId}/comments?dataCursor=${dataCursor}&dataCeiling=${dataCeiling}`
    ),
  success: { message: "Comments successfully fetched", variant: "success" },
  error: { message: "Failed to fetch comments", variant: "error" },
};
export const patchComment = {
  request: async ({ artworkId, commentId, data }) =>
    await ax.patch(`/api/artwork/${artworkId}/comment/${commentId}`, data),
  success: { message: "Comment successfully updated", variant: "success" },
  error: { message: "Failed to update comment", variant: "error" },
};
export const postComment = {
  request: async ({ artworkId, data }) =>
    await ax.post(`/api/artwork/${artworkId}/comment`, data),
  success: { message: "Comment successfully posted", variant: "success" },
  error: { message: "Failed to post comment", variant: "error" },
};
export const editArtwork = {
  request: async (_, { artworkId }) =>
    await ax.get(`/api/edit_artwork/${artworkId}`),
  success: { message: "Artwork successfully fetched", variant: "success" },
  error: { message: "Failed to fetch artwork", variant: "error" },
};
export const deleteArtwork = {
  request: async ({ artworkId }) =>
    await ax.delete(`/api/edit_artwork/${artworkId}`),
  success: { message: "Artwork successfully deleted", variant: "success" },
  error: { message: "Failed to delete artwork", variant: "error" },
};
export const patchArtwork = {
  request: async ({ artworkId, data }) =>
    await ax.patch(`/api/edit_artwork/${artworkId}`, data),
  success: { message: "Artwork successfully updated", variant: "success" },
  error: { message: "Failed to update artwork", variant: "error" },
};
export const getGallery = {
  request: async (_, { dataCursor = null, dataCeiling = null }) =>
    typeof dataCursor !== null && typeof dataCeiling !== null
      ? await ax.get(
          `/api/my_artwork?dataCursor=${dataCursor}&dataCeiling=${dataCeiling}`
        )
      : await ax.get("/api/my_artwork"),
  success: { message: "Artwork successfully fetched", variant: "success" },
  error: { message: "Failed to fetch artwork", variant: "error" },
};
export const postSave = {
  request: async ({ artworkId }) =>
    await ax.post(`/api/save_artwork/${artworkId}`),
  success: { message: "Artwork successfully saved", variant: "success" },
  error: { message: "Failed to save artwork", variant: "error" },
};
export const deleteSave = {
  request: async ({ artworkId }) =>
    await ax.delete(`/api/save_artwork/${artworkId}`),
  success: { message: "Artwork successfully unsaved", variant: "success" },
  error: { message: "Failed to unsaved artwork", variant: "error" },
};
export const getSaves = {
  request: async (_, { userId }) =>
    await ax.get(`/api/user/${userId}/saved_artwork`),
  success: { message: "Saves successfully fetched", variant: "success" },
  error: { message: "Failed to fetch saves", variant: "error" },
};
