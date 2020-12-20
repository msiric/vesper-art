import { ax } from "../containers/Interceptor/Interceptor.js";

export const postVerifier = {
  request: async ({ data }) => await ax.post("/api/verifier", data),
  success: { message: "License successfully verified", variant: "success" },
  error: { message: "Failed to verify license", variant: "error" },
};
export const getSearch = {
  request: async (_, { searchQuery, dataCursor, dataCeiling }) =>
    await ax.get(
      `/api/search${searchQuery}&dataCursor=${dataCursor}&dataCeiling=${dataCeiling}`
    ),
  success: { message: "Search successfully executed", variant: "success" },
  error: { message: "Failed to execute search", variant: "error" },
};
