const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose')
require('dotenv').config();
const comparisonsRouter = require('./controllers/comparisons')

const options = {
    root: path.join(__dirname, '/'),
};

const mongoUri = process.env.MONGO_URI

mongoose.connect(
    mongoUri,
    { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true }
).then(() => {
    console.log('connected to DB')
})

app.get('/', (_, response) => {
    response.sendFile('/index.html', options);
});

app.use('/api/comparisons', comparisonsRouter)

const PORT = 3002;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
