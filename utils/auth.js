import createError from "http-errors";
import jwt from "jsonwebtoken";
import { auth, cookieKeys } from "../common/constants";
import { tokens } from "../config/secret";
import { fetchUserByAuth } from "../services/user";
import { formatError, formatTokenData, verifyTokenValidity } from "./helpers";
import { errors } from "./statuses";

export const createAccessToken = ({ userData }) => {
  return jwt.sign(
    {
      ...userData,
    },
    tokens.accessToken,
    {
      expiresIn: tokens.accessExpiry,
    }
  );
};

// $TODO getConnection needs to come from one of the services
export const updateAccessToken = async ({ cookies, response, connection }) => {
  const refreshToken = cookies[cookieKeys.jid];
  if (!refreshToken) throw createError(...formatError(errors.forbiddenAccess));

  const { data } = verifyTokenValidity(
    refreshToken,
    tokens.refreshToken,
    false
  );
  // const foundUser = await User.findOne({
  //   where: [{ id: data.userId, active: true }],
  //   relations: ["avatar", "favorites", "favorites.artwork", "intents"],
  // });

  const foundUser = await fetchUserByAuth({
    userId: data.userId,
    connection,
  });

  if (!foundUser) {
    throw createError(...formatError(errors.forbiddenAccess));
  }

  if (foundUser.jwtVersion !== data.jwtVersion) {
    throw createError(...formatError(errors.forbiddenAccess));
  }

  if (!foundUser.verified) {
    throw createError(...formatError(errors.userNotVerified));
  }

  const { tokenPayload, userInfo } = formatTokenData({ user: foundUser });

  const newRefreshToken = createRefreshToken({ userData: tokenPayload });

  sendRefreshToken({ response, refreshToken: newRefreshToken });

  return {
    ok: true,
    accessToken: createAccessToken({ userData: tokenPayload }),
    user: userInfo,
  };
};

export const createRefreshToken = ({ userData }) => {
  return jwt.sign(
    { userId: userData.id, jwtVersion: userData.jwtVersion },
    tokens.refreshToken,
    {
      expiresIn: tokens.refreshExpiry,
    }
  );
};

export const sendRefreshToken = ({ response, refreshToken }) => {
  return response.cookie(cookieKeys.jid, refreshToken, {
    httpOnly: true,
    path: auth.refreshEndpoint,
  });
};
