const jwt = require('jsonwebtoken');

const createAccessToken = user => {
  return jwt.sign({ userId: user.id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '15m'
  });
};

const createRefreshToken = user => {
  return jwt.sign(
    { userId: user.id, jwtVersion: user.jwtVersion },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: '7d'
    }
  );
};

const sendRefreshToken = (res, token) => {
  res.cookie('jid', token, {
    httpOnly: true,
    path: 'api/auth/refresh_token'
  });
};

module.exports = {
  createAccessToken,
  createRefreshToken,
  sendRefreshToken
};
