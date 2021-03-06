const comparisonsRouter = require('express').Router()
const Comparison = require('../models/comparison')
const User = require('../models/user')
const helper = require('../utils/helper')
const jwt = require('jsonwebtoken')

// should this be a POST request since it can also save comparison to DB?
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

comparisonsRouter.get('/save/:id', async (request, response) => {
    const comparison = await Comparison.findById(request.params.id)

    const token = helper.getTokenFrom(request)
    console.log('token: ', token)
    const decodedToken = jwt.verify(token, process.env.SECRET)

    if (!token || !decodedToken.id) {
        response.status(401).json({ error: 'token missing or invalid' })
    }

    console.log('decodedToken: ', decodedToken)

    const userId = decodedToken.id
    console.log('userId: ', userId)

    const user = await User.findById(userId)

    console.log('user: ', user)

    comparison.users = comparison.users.concat(user._id)
    user.savedComparisons = user.savedComparisons.concat(comparison._id)

    const savedComparison = await comparison.save()
    await user.save()

    response.status(201).json(savedComparison)
})

comparisonsRouter.get('/all', async (request, response) => {
    const comparisons = await Comparison.find({})

    const table = `<h1>There are ${comparisons.length} comparisons in the database</h1><table><thead><tr><th>User 1</th><th>User 2</th><th>Common beers</th></tr></thead><tbody>`
    const beerRows = comparisons.map(comp => `<tr><td>${comp.untappdUsers[0]}</td><td>${comp.untappdUsers[1]}</td><td>${comp.commonBeers.length}</td></tr>`)
    const html = `${table}${beerRows.join('')}</tbody></table>`

    response.send(html)
})

module.exports = comparisonsRouter