const usersSsrRouter = require('express').Router();
const path = require('path');
const usersService = require('../services/usersService');
const User = require('../models/user');

const options = {
    root: path.join(__dirname, '../'),
};

// Form to register a new user
usersSsrRouter.get('/register', async (request, response) => {
    response.sendFile('/register.html', options);
});

// Route to register a new user
usersSsrRouter.post('/register', async (request, response) => {
    const body = request.body;
    const savedUser = await usersService.registerUser(body.username, body.password);

    response.redirect('/api/login');
});

// Page with login form
usersSsrRouter.get('/login', (request, response) => {
    response.sendFile('/login.html', options);
});

// Login and obtain a token (stored in a cookie)
usersSsrRouter.post('/login', async (request, response) => {
    const body = request.body;
    const token = await usersService.loginUser(body.username, body.password);

    response
        .status(200)
        .cookie('token', `Bearer ${token}`, { httpOnly: true })
        .cookie('loggedIn', 'true')
        .redirect('../..');
});

usersSsrRouter.get('/logout', (request, response) => {
    response.status(200).clearCookie('token').clearCookie('loggedIn').redirect('../..');
});

module.exports = usersSsrRouter;