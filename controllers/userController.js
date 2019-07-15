const passport = require('passport');
const passportConfig = require('../config/passport');
const User = require('../models/user');
const randomString = require('randomstring');
const axios = require('axios');

const postSignUp = async (req, res, next) => {
  try {
    const foundUser = await User.findOne({
      $or: [{ email: req.body.email }, { name: req.body.username }]
    });
    if (foundUser) {
      return res
        .status(400)
        .json({ message: 'Account with that email/username already exists' });
    } else {
      let verificationInfo = {
        token: randomString.generate(),
        email: req.body.email
      };
      let user = new User();
      user.name = req.body.username;
      user.email = req.body.email;
      user.photo = foundUser.gravatar();
      user.password = req.body.password;
      user.customWork = true;
      user.secretToken = verificationInfo.token;
      user.verified = false;
      const savedUser = await user.save();
      if (savedUser) {
        axios
          .post('http://localhost:3000/send-email', verificationInfo, {
            proxy: false
          })
          .then(res => {
            console.log(`statusCode: ${res.statusCode}`);
            console.log(res);
          })
          .catch(error => {
            console.error(error);
          });
        return res
          .status(200)
          .json({ message: 'Account created successfully' });
      } else {
        return res.status(400).json({ message: 'Could not create account' });
      }
    }
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};
