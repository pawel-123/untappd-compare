const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const getUsers = async () => {
  const users = await User.find({});
  return users;
};

const registerUser = async (username, password) => {
  if (password < 6) {
    response.status(403).json({ error: 'password too short' });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = new User({
    username: username,
    passwordHash
  });

  const savedUser = await user.save();

  return savedUser;
}

const loginUser = async (username, password) => {
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

  const token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: "30m" });

  return token;
}

module.exports = { getUsers, registerUser, loginUser }