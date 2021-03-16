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

module.exports = usersSsrRouter;