import { ax } from "../containers/Interceptor";

export const postVerifier = {
  request: async ({ data }) => await ax.post("/api/verifier", data),
  success: { message: "License successfully verified", variant: "success" },
  error: { message: "Failed to verify license", variant: "error" },
};
export const getSearch = {
  request: async ({ searchQuery, cursor = "", limit = "" }) =>
    await ax.get(`/api/search${searchQuery}&cursor=${cursor}&limit=${limit}`),
  success: { message: "Search successfully executed", variant: "success" },
  error: { message: "Failed to execute search", variant: "error" },
};
