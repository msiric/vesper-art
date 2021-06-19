import { ax } from "../containers/Interceptor/Interceptor.js";

export const postVerifier = {
  request: async ({ licenseData }) =>
    await ax.post("/api/verifier", licenseData),
  success: { message: "License successfully verified", variant: "success" },
  error: { message: "Failed to verify license", variant: "error" },
};
export const getSearch = {
  request: async ({ searchQuery, cursor = "", limit = "" }) =>
    await ax.get(`/api/search${searchQuery}&cursor=${cursor}&limit=${limit}`),
  success: { message: "Search successfully executed", variant: "success" },
  error: { message: "Failed to execute search", variant: "error" },
};
