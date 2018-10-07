const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/user.model');

function login(req, res, next) {
  User.findOne({ email: req.body.email })
    .select('_id password email firstName lastName role')
    .exec()
    .then(user => {
      if (!user) {
        return res
          .status(500)
          .json({ message: 'Email or password does not match' });
      }

      return user
        .authenticate(req.body.password)
        .then(() => {
          const token = jwt.sign(
            {
              _id: user._id, // eslint-disable-line
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              role: user.role,
            },
            config.jwtSecret,
            { expiresIn: config.jwtExpires },
          );

          res.json({
            _id: user._id, // eslint-disable-line
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            token,
          });
        })
        .catch(() => {
          res.status(500).json({ message: 'Email or password does not match' });
        });
    })
    .catch(next);
}

function signup(req, res, next) {
  const user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
  });

  user
    .save()
    .then(newUser => {
      res.json(newUser);
    })
    .catch(next);
}

module.exports = {
  login,
  signup,
};
