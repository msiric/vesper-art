const User = require('../models/user');
const auth = require('../utils/auth');
const jwt = require('jsonwebtoken');

const postRefreshToken = async (req, res) => {
  const token = req.cookies.jid;
  if (!token) {
    return res.send({ ok: false, accessToken: '' });
  }

  let payload = null;
  try {
    payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
  } catch (err) {
    console.log(err);
    return res.send({ ok: false, accessToken: '' });
  }

  const foundUser = await User.findOne({ id: payload.userId });

  if (!foundUser) {
    return res.send({ ok: false, accessToken: '' });
  }

  if (foundUser.jwtVersion !== payload.jwtVersion) {
    return res.send({ ok: false, accessToken: '' });
  }

  auth.sendRefreshToken(res, auth.createRefreshToken(foundUser));

  return res.send({ ok: true, accessToken: auth.createAccessToken(foundUser) });
};

const postRevokeToken = async (req, res, next) => {
  try {
    const userId = req.params.id;

    await User.findOneAndUpdate({ id: userId }, { $inc: { jwtVersion: 1 } });

    res.status(200);
  } catch (err) {
    next(err, res);
  }
};

module.exports = {
  postRefreshToken,
  postRevokeToken
};
