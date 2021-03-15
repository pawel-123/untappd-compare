const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const loginRouter = require('express').Router();
const User = require('../models/user');

const options = {
    root: path.join(__dirname, '../'),
};

// Page with login form
loginRouter.get('/', (request, response) => {
    response.sendFile('/login.html', options);
});

// Login and obtain a token (stored in a cookie)
loginRouter.post('/', async (request, response) => {
    const body = request.body;

    const user = await User.findOne({ username: body.username });

    const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(body.password, user.passwordHash);

    if (!(user && passwordCorrect)) {
        return response.status(401).json({
            error: 'invalid username or password'
        });
    }

    const userForToken = {
        username: user.username,
        id: user._id
    };

    const token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: "1m" });

    response
        .status(200)
        .cookie('token', `Bearer ${token}`, { httpOnly: true })
        .redirect('../..');
});

module.exports = loginRouter;