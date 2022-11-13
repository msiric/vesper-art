import { ax } from "../containers/Interceptor";

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
  request: async ({ cursor = "", limit = "" }) =>
    await ax.get(`/api/artwork?cursor=${cursor}&limit=${limit}`),
  success: { message: "Artwork successfully fetched", variant: "success" },
  error: { message: "Failed to fetch artwork", variant: "error" },
};
export const getDetails = {
  request: async ({ artworkId, cursor = "", limit = "" }) =>
    await ax.get(`/api/artwork/${artworkId}?cursor=${cursor}&limit=${limit}`),
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
  request: async ({ userId, commentId }) =>
    await ax.delete(`/api/users/${userId}/comments/${commentId}`),
  success: { message: "Comment successfully deleted", variant: "success" },
  error: { message: "Failed to delete comment", variant: "error" },
};
export const getComments = {
  request: async ({ artworkId, cursor = "", limit = "" }) =>
    await ax.get(
      `/api/artwork/${artworkId}/comments?cursor=${cursor}&limit=${limit}`
    ),
  success: { message: "Comments successfully fetched", variant: "success" },
  error: { message: "Failed to fetch comments", variant: "error" },
};
export const patchComment = {
  request: async ({ userId, commentId, data }) =>
    await ax.patch(`/api/users/${userId}/comments/${commentId}`, data),
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
  request: async ({ userId, artworkId }) =>
    await ax.get(`/api/users/${userId}/artwork/${artworkId}`),
  success: { message: "Artwork successfully fetched", variant: "success" },
  error: { message: "Failed to fetch artwork", variant: "error" },
};
export const deleteArtwork = {
  request: async ({ userId, artworkId }) =>
    await ax.delete(`/api/users/${userId}/artwork/${artworkId}`),
  success: { message: "Artwork successfully deleted", variant: "success" },
  error: { message: "Failed to delete artwork", variant: "error" },
};
export const patchArtwork = {
  request: async ({ userId, artworkId, data }) =>
    await ax.patch(`/api/users/${userId}/artwork/${artworkId}`, data),
  success: { message: "Artwork successfully updated", variant: "success" },
  error: { message: "Failed to update artwork", variant: "error" },
};
export const getGallery = {
  request: async ({ userId, cursor = "", limit = "" }) =>
    await ax.get(
      `/api/users/${userId}/artwork?cursor=${cursor}&limit=${limit}`
    ),
  success: { message: "Artwork successfully fetched", variant: "success" },
  error: { message: "Failed to fetch artwork", variant: "error" },
};
export const postFavorite = {
  request: async ({ artworkId }) =>
    await ax.post(`/api/artwork/${artworkId}/favorites`),
  success: { message: "Artwork successfully favorited", variant: "success" },
  error: { message: "Failed to favorite artwork", variant: "error" },
};
export const deleteFavorite = {
  request: async ({ artworkId }) =>
    await ax.delete(`/api/artwork/${artworkId}/favorites`),
  success: { message: "Artwork successfully unfavorited", variant: "success" },
  error: { message: "Failed to unfavorited artwork", variant: "error" },
};
export const getFavorites = {
  request: async ({ artworkId }) =>
    await ax.get(`/api/artwork/${artworkId}/favorites`),
  success: { message: "Favorites successfully fetched", variant: "success" },
  error: { message: "Failed to fetch favorites", variant: "error" },
};
export const postLike = {
  request: async ({ artworkId, commentId }) =>
    await ax.post(`/api/artwork/${artworkId}/comments/${commentId}/likes`),
  success: { message: "Comment successfully liked", variant: "success" },
  error: { message: "Failed to like comment", variant: "error" },
};
export const deleteLike = {
  request: async ({ artworkId, commentId }) =>
    await ax.delete(`/api/artwork/${artworkId}/comments/${commentId}/likes`),
  success: { message: "Comment successfully disliked", variant: "success" },
  error: { message: "Failed to dislike comment", variant: "error" },
};
