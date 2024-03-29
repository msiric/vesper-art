import { ax } from "../containers/Interceptor";

export const postRecover = {
  request: async ({ data }) => await ax.post("/auth/forgot_password", data),
  success: { message: "Recovery email successfully sent", variant: "success" },
  error: { message: "Failed to send recovery email", variant: "error" },
};
export const postLogin = {
  request: async ({ data }) => await ax.post("/auth/login", data),
  success: { message: "User successfully logged in", variant: "success" },
  error: { message: "Failed to log in user", variant: "error" },
};
export const postReset = {
  request: async ({ userId, resetToken, data }) =>
    await ax.post(
      `/auth/reset_password/user/${userId}/token/${resetToken}`,
      data
    ),
  success: { message: "Password successfully reset", variant: "success" },
  error: { message: "Failed to reset password", variant: "error" },
};
export const postRefresh = {
  request: async () =>
    await ax.post("/auth/refresh_token", {
      headers: {
        credentials: "include",
      },
    }),
  success: {
    message: "Access token successfully refreshed",
    variant: "success",
  },
  error: { message: "Failed to refresh access token", variant: "error" },
};
export const postSignup = {
  request: async ({ data }) => await ax.post("/auth/signup", data),
  success: { message: "User successfully signed up", variant: "success" },
  error: { message: "Failed to sign up user", variant: "error" },
};
export const getToken = {
  request: async ({ tokenId }) => await ax.get(`/auth/verify_token/${tokenId}`),
  success: { message: "Token successfully verified", variant: "success" },
  error: { message: "Failed to verify token", variant: "error" },
};
export const postResend = {
  request: async ({ data }) => await ax.post("/auth/resend_token", data),
  success: {
    message: "Verification token successfully sent",
    variant: "success",
  },
  error: { message: "Failed to send verification token", variant: "error" },
};
export const postEmail = {
  request: async ({ data }) => await ax.post("/auth/update_email", data),
  success: {
    message: "Email successfully updated",
    variant: "success",
  },
  error: { message: "Failed to update email", variant: "error" },
};
