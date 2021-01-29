import { ax } from "../containers/Interceptor/Interceptor.js";

export const postMedia = {
  request: async ({ data }) => await ax.post("/api/artwork_media_upload", data),
  success: { message: "Cover successfully uploaded", variant: "success" },
  error: { message: "Failed to upload cover", variant: "error" },
};
export const postArtwork = {
  request: async ({ data }) => await ax.post("/api/artwork", data),
  success: { message: "Artwork successfully published", variant: "success" },
  error: { message: "Failed to publish artwork", variant: "error" },
};
export const getArtwork = {
  request: async ({ cursor = null, limit = null }) =>
    typeof cursor !== null && typeof limit !== null
      ? await ax.get(`/api/artwork?cursor=${cursor}&limit=${limit}`)
      : await ax.get(`/api/artwork`),
  success: { message: "Artwork successfully fetched", variant: "success" },
  error: { message: "Failed to fetch artwork", variant: "error" },
};
export const getDetails = {
  request: async ({ artworkId, cursor = null, limit = null }) =>
    typeof cursor !== null && typeof limit !== null
      ? await ax.get(
          `/api/artwork/${artworkId}?cursor=${cursor}&limit=${limit}`
        )
      : await ax.get(`/api/artwork/${artworkId}`),
  success: { message: "Artwork successfully fetched", variant: "success" },
  error: { message: "Failed to fetch artwork", variant: "error" },
};
export const getComment = {
  request: async ({ artworkId, commentId }) =>
    await ax.get(`/api/artwork/${artworkId}/comments/${commentId}`),
  success: { message: "Comment successfully fetched", variant: "success" },
  error: { message: "Failed to fetch comment", variant: "error" },
};
export const deleteComment = {
  request: async ({ artworkId, commentId }) =>
    await ax.delete(`/api/artwork/${artworkId}/comments/${commentId}`),
  success: { message: "Comment successfully deleted", variant: "success" },
  error: { message: "Failed to delete comment", variant: "error" },
};
export const getComments = {
  request: async ({ artworkId, cursor = null, limit = null }) =>
    await ax.get(
      `/api/artwork/${artworkId}/comments?cursor=${cursor}&limit=${limit}`
    ),
  success: { message: "Comments successfully fetched", variant: "success" },
  error: { message: "Failed to fetch comments", variant: "error" },
};
export const patchComment = {
  request: async ({ artworkId, commentId, data }) =>
    await ax.patch(`/api/artwork/${artworkId}/comments/${commentId}`, data),
  success: { message: "Comment successfully updated", variant: "success" },
  error: { message: "Failed to update comment", variant: "error" },
};
export const postComment = {
  request: async ({ artworkId, data }) =>
    await ax.post(`/api/artwork/${artworkId}/comments`, data),
  success: { message: "Comment successfully posted", variant: "success" },
  error: { message: "Failed to post comment", variant: "error" },
};
export const editArtwork = {
  request: async ({ artworkId }) => await ax.get(`/api/artwork/${artworkId}`),
  success: { message: "Artwork successfully fetched", variant: "success" },
  error: { message: "Failed to fetch artwork", variant: "error" },
};
export const deleteArtwork = {
  request: async ({ artworkId }) => await ax(`/api/artwork/${artworkId}`),
  success: { message: "Artwork successfully deleted", variant: "success" },
  error: { message: "Failed to delete artwork", variant: "error" },
};
export const patchArtwork = {
  request: async ({ artworkId, data }) =>
    await ax.patch(`/api/artwork/${artworkId}`, data),
  success: { message: "Artwork successfully updated", variant: "success" },
  error: { message: "Failed to update artwork", variant: "error" },
};
export const getGallery = {
  request: async ({ userId, cursor = null, limit = null }) =>
    typeof cursor !== null && typeof limit !== null
      ? await ax.get(
          `/api/users/${userId}/artwork?cursor=${cursor}&limit=${limit}`
        )
      : await ax.get(`/api/users/${userId}/artwork`),
  success: { message: "Artwork successfully fetched", variant: "success" },
  error: { message: "Failed to fetch artwork", variant: "error" },
};
export const postFavorite = {
  request: async ({ artworkId }) =>
    await ax.post(`/api/artwork/${artworkId}/favorites`),
  success: { message: "Artwork successfully saved", variant: "success" },
  error: { message: "Failed to favorite artwork", variant: "error" },
};
export const deleteFavorite = {
  request: async ({ artworkId }) =>
    await ax.delete(`/api/artwork/${artworkId}/favorites`),
  success: { message: "Artwork successfully unsaved", variant: "success" },
  error: { message: "Failed to unsaved artwork", variant: "error" },
};
export const getFavorites = {
  request: async ({ artworkId }) =>
    await ax.get(`/api/artwork/${artworkId}/favorites`),
  success: { message: "Favorites successfully fetched", variant: "success" },
  error: { message: "Failed to fetch favorites", variant: "error" },
};
