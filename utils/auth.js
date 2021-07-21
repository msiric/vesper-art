import createError from "http-errors";
import jwt from "jsonwebtoken";
import { auth } from "../common/constants";
import { tokens } from "../config/secret";
import { fetchUserByAuth } from "../services/postgres/user";
import { formatError, formatTokenData } from "./helpers";
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
export const updateAccessToken = async (req, res, next, connection) => {
  const token = req.cookies.jid;
  if (!token) throw createError(...formatError(errors.forbiddenAccess));

  let payload = null;
  try {
    payload = jwt.verify(token, tokens.refreshToken);
  } catch (err) {
    console.log(err);
    throw createError(...formatError(errors.forbiddenAccess));
  }

  // const foundUser = await User.findOne({
  //   where: [{ id: payload.userId, active: true }],
  //   relations: ["avatar", "favorites", "favorites.artwork", "intents"],
  // });

  const foundUser = await fetchUserByAuth({
    userId: payload.userId,
    connection,
  });

  if (!foundUser) {
    throw createError(...formatError(errors.forbiddenAccess));
  }

  if (foundUser.jwtVersion !== payload.jwtVersion) {
    throw createError(...formatError(errors.forbiddenAccess));
  }

  if (!foundUser.verified) {
    throw createError(...formatError(errors.userNotVerified));
  }

  const { tokenPayload, userInfo } = formatTokenData({ user: foundUser });

  sendRefreshToken(res, createRefreshToken({ userData: tokenPayload }));

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

export const sendRefreshToken = (res, refreshToken) => {
  return res.cookie("jid", refreshToken, {
    httpOnly: true,
    path: auth.refreshEndpoint,
  });
};
