import jwt from "jsonwebtoken";
import { tokens } from "../config/secret";
import { fetchUserByAuth } from "../services/postgres/user";

export const createAccessToken = ({ userData }) => {
  return jwt.sign(
    {
      id: userData.id,
      name: userData.name,
      onboarded: userData.onboarded,
      jwtVersion: userData.jwtVersion,
      active: userData.active,
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
  if (!token) return { ok: false, accessToken: "" };

  let payload = null;
  try {
    payload = jwt.verify(token, tokens.refreshToken);
  } catch (err) {
    console.log(err);
    return { ok: false, accessToken: "" };
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
    return { ok: false, accessToken: "" };
  }

  if (foundUser.jwtVersion !== payload.jwtVersion) {
    return { ok: false, accessToken: "" };
  }

  const tokenPayload = {
    id: foundUser.id,
    name: foundUser.name,
    jwtVersion: foundUser.jwtVersion,
    onboarded: !!foundUser.stripeId,
    active: foundUser.active,
  };

  const userInfo = {
    id: foundUser.id,
    name: foundUser.name,
    email: foundUser.email,
    avatar: foundUser.avatar,
    notifications: foundUser.notifications,
    active: foundUser.active,
    stripeId: foundUser.stripeId,
    country: foundUser.country,
    businessAddress: foundUser.businessAddress,
    jwtVersion: foundUser.jwtVersion,
    favorites: foundUser.favorites,
    intents: foundUser.intents,
  };

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
    path: tokens.refreshPath,
  });
};
