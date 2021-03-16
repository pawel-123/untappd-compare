const express = require('express');
require('express-async-errors');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const comparisonsApiRouter = require('./controllers/comparisonsApi');
const comparisonsSsrRouter = require('./controllers/comparisonsSsr');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const middleware = require('./utils/middleware');

const options = {
    root: path.join(__dirname, '/'),
};

const mongoUri = process.env.MONGO_URI;

mongoose.connect(
    mongoUri,
    { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true }
).then(() => {
    console.log('connected to DB');
});

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Home page with login/register/log out and a form to request a comparison
app.get('/', (request, response) => {
    response.sendFile('/index.html', options);
});

app.use('/api/comparisons', comparisonsApiRouter);

app.use('/comparisons', comparisonsSsrRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);
app.get('/api/logout', (request, response) => {
    response.status(200).clearCookie('token').clearCookie('loggedIn').redirect('../..');
});

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

const PORT = 3002;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
