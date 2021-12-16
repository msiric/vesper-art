import { createAccessToken, createRefreshToken } from "../../utils/auth";
import { formatTokenData } from "../../utils/helpers";

export const unusedToken = "340a2423-eb66-48f0-9372-4a31f781d022";

export const logUserIn = (user) => {
  const { tokenPayload: payload } = formatTokenData({ user });
  const cookie = createRefreshToken({ userData: payload });
  const token = createAccessToken({ userData: payload });
  return { cookie, token };
};
