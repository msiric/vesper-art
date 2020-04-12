const User = require('../models/user');
const jwt = require('jsonwebtoken');

const createAccessToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      name: user.name,
      photo: user.photo,
      inbox: user.inbox,
      notifications: user.notifications,
      cart: user.cart.length,
      active: user.active,
      jwtVersion: user.jwtVersion,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: '30s',
    }
  );
};

const updateAccessToken = async (req, res, next) => {
  const token = req.cookies.jid;
  console.log('token', token);
  if (!token) {
    return { ok: false, accessToken: '' };
  }

  let payload = null;
  try {
    payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
  } catch (err) {
    console.log(err);
    return { ok: false, accessToken: '' };
  }

  const foundUser = await User.findOne({ _id: payload.userId });

  if (!foundUser) {
    return { ok: false, accessToken: '' };
  }

  if (foundUser.jwtVersion !== payload.jwtVersion) {
    return { ok: false, accessToken: '' };
  }

  const tokenPayload = {
    id: foundUser.id,
    name: foundUser.name,
    photo: foundUser.photo,
    inbox: foundUser.inbox,
    notifications: foundUser.notifications,
    cart: foundUser.cart.length,
    active: foundUser.active,
    jwtVersion: foundUser.jwtVersion,
  };

  sendRefreshToken(res, createRefreshToken(tokenPayload));

  return {
    ok: true,
    accessToken: createAccessToken(tokenPayload),
  };
};

const createRefreshToken = (user) => {
  return jwt.sign(
    { userId: user.id, jwtVersion: user.jwtVersion },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: '7d',
    }
  );
};

const sendRefreshToken = (res, token) => {
  res.cookie('jid', token, {
    httpOnly: true,
    path: 'api/auth/refresh_token',
  });
};

module.exports = {
  createAccessToken,
  updateAccessToken,
  createRefreshToken,
  sendRefreshToken,
};
