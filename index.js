const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose')
require('dotenv').config();
const compareBeers = require('./compareBeers');
const Comparison = require('./models/comparison')

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

app.get('/api/comparison', async (request, response) => {
    const { user1, user2 } = request.query

    const existingComparison = await Comparison.findOne({ untappdUsers: [user1, user2] })

    let commonBeers;

    if (!existingComparison) {
        commonBeers = await compareBeers(user1, user2);

        const comparison = new Comparison({
            untappdUsers: [user1, user2],
            commonBeers: commonBeers,
            date: new Date()
        })

        await comparison.save()
        console.log('fetched commonBeers from Untappd and saved to database')
    } else {
        commonBeers = existingComparison.commonBeers
        console.log('fetched commonBeers from database')
    }

    const greeting = `<p>${user1} and ${user2} have ${commonBeers.length} beers in common:</p><ul>`;
    const beers = commonBeers.map(beer => `<li>${beer.beer_name}</li>`);

    const html = `${greeting}<ul>${beers.join('')}</ul>`;

    response.send(html);
});

app.get('/api/comparisons', async (request, response) => {
    const comparisons = await Comparison.find({})
    console.log(comparisons)
    response.json(comparisons)
})

const PORT = 3002;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
