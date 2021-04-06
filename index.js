const express = require('express');
const cors = require('cors');
require('express-async-errors');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const comparisonsApiRouter = require('./controllers/comparisonsApi');
const comparisonsSsrRouter = require('./controllers/comparisonsSsr');
const usersApiRouter = require('./controllers/usersApi');
const usersSsrRouter = require('./controllers/usersSsr');
const middleware = require('./utils/middleware');

const options = {
  root: path.join(__dirname, '/'),
};

const corsOptions = {
  origin: ['http://localhost:8080'],
  credentials: true,
  preflightContinue: true
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
app.use(cors(corsOptions));

// Home page with login/register/log out and a form to request a comparison
app.get('/', (request, response) => {
  response.sendFile('/index.html', options);
});

app.use('/api/comparisons', comparisonsApiRouter);
app.use('/api/users', usersApiRouter);

app.use('/comparisons', comparisonsSsrRouter);
app.use('/users', usersSsrRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

const PORT = 3002;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
