const usersApiRouter = require('express').Router();
const helper = require('../utils/helper');
const usersService = require('../services/usersService');

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

// Login and obtain a token
usersApiRouter.post('/login', async (request, response) => {
  const body = request.body;
  const loginData = await usersService.loginUser(body.username, body.password);

  // response.json({ token: loginData.token });
  response
    // .cookie('token', `Bearer ${loginData.token}`, { domain: 'untappdcompare.com', secure: true, sameSite: 'None' })
    .cookie('token', `Bearer ${loginData.token}`, { sameSite: 'None' })
    .json(loginData);
});

module.exports = usersApiRouter;