const usersApiRouter = require('express').Router();
const path = require('path');
const helper = require('../utils/helper');
const usersService = require('../services/usersService');

const options = {
    root: path.join(__dirname, '../'),
};

// View all users, requires authorization
usersApiRouter.get('/', helper.authenticateToken, async (request, response) => {
    const users = await usersService.getUsers();

    response.json(users);
});

// Route to register a new user
usersApiRouter.post('/register', async (request, response) => {
    const body = request.body;
    const savedUser = await usersService.registerUser(body.username, body.password);

    response.json(savedUser);
});

module.exports = usersApiRouter;