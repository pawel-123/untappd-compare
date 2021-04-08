const usersSsrRouter = require('express').Router();
const path = require('path');
const usersService = require('../services/usersService');

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
  await usersService.registerUser(body.username, body.password, response);

  response.redirect('/users/login');
});

// Page with login form
usersSsrRouter.get('/login', (request, response) => {
  response.sendFile('/login.html', options);
});

// Login and obtain a token (stored in a cookie)
usersSsrRouter.post('/login', async (request, response) => {
  const body = request.body;
  const loginData = await usersService.loginUser(body.username, body.password, response);
  console.log('usersSSr login route running');

  response
    .status(200)
    .cookie('token', `Bearer ${loginData.token}`, { httpOnly: true })
    .cookie('loggedIn', 'true')
    .redirect('../..');
});

usersSsrRouter.get('/logout', (request, response) => {
  response.status(200).clearCookie('token').clearCookie('loggedIn').redirect('../..');
});

module.exports = usersSsrRouter;