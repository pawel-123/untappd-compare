const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const path = require('path');
const jwt = require('jsonwebtoken');
const helper = require('../utils/helper');
const User = require('../models/user');

const options = {
    root: path.join(__dirname, '../'),
};

// View all users, requires authorization
usersRouter.get('/', helper.authenticateToken, async (request, response) => {
    const users = await User.find({});
    response.json(users);
});

// Form to register a new user
usersRouter.get('/register', async (request, response) => {
    response.sendFile('/register.html', options);
});

// Route to register a new user
usersRouter.post('/register', async (request, response) => {
    const body = request.body;

    if (body.password.length < 6) {
        response.status(403).json({ error: 'password too short' });
    }

    const passwordHash = await bcrypt.hash(body.password, 10);

    const user = new User({
        username: body.username,
        passwordHash
    });

    const savedUser = await user.save();

    response.json(savedUser);
});

module.exports = usersRouter;