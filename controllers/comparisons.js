const comparisonsRouter = require('express').Router()
const Comparison = require('../models/comparison')
const helper = require('../utils/helper')
const jwt = require('jsonwebtoken')

comparisonsRouter.get('/', async (request, response) => {
    const { user1, user2 } = request.query
    const token = helper.getTokenFrom(request)
    const decodedToken = jwt.verify(token, process.env.SECRET)

    if (!token || !decodedToken) {
        response.status(401).json({ error: 'token missing or invalid' })
    }

    const findComparison = (userA, userB) => Comparison.findOne({ untappdUsers: [userA, userB] })

    const existingComparison = await findComparison(user1, user2) || await findComparison(user2, user1)

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

comparisonsRouter.get('/all', async (request, response) => {
    const comparisons = await Comparison.find({})

    const table = `<h1>There are ${comparisons.length} comparisons in the database</h1><table><thead><tr><th>User 1</th><th>User 2</th><th>Common beers</th></tr></thead><tbody>`
    const beerRows = comparisons.map(comp => `<tr><td>${comp.untappdUsers[0]}</td><td>${comp.untappdUsers[1]}</td><td>${comp.commonBeers.length}</td></tr>`)
    const html = `${table}${beerRows.join('')}</tbody></table>`

    response.send(html)
})

module.exports = comparisonsRouter