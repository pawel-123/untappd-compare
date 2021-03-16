const bcrypt = require('bcrypt');
const User = require('../models/user');

const getUsers = async () => {
    const users = await User.find({});
    return users;
}

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

module.exports = { getUsers, registerUser }