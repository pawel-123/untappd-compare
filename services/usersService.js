const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const getUsers = async () => {
  const users = await User.find({});
  return users;
};

const registerUser = async (username, password, response) => {
  if (password.length < 6) {
    return response.status(403).json({ error: 'password too short' });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = new User({
    username: username,
    passwordHash
  });

  const savedUser = await user.save();

  return savedUser;
};

const loginUser = async (username, password, response) => {
  const user = await User.findOne({ username: username });

  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash);

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    });
  }

  const userForToken = {
    username: user.username,
    id: user._id
  };

  const token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: '24h' });

  // return token;
  return { token: token, username: user.username, id: user._id };
};

module.exports = { getUsers, registerUser, loginUser };