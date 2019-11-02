const isLoggedInAPI = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ message: 'Unauthorized' });
};

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    console.log(req.body);
    return next();
  }
  res.redirect('/login');
};

const isLoggedOut = (req, res, next) => {
  if (!req.isAuthenticated()) return next();
  res.redirect('/');
};

module.exports = { isLoggedInAPI, isLoggedIn, isLoggedOut };
