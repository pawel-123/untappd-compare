const comparisonsSsrRouter = require('express').Router();
const comparisonsService = require('../services/comparisonsService');
const helper = require('../utils/helper');

// View all comparisons
comparisonsSsrRouter.get('/', helper.authenticateToken, async (request, response) => {
    const comparisons = await comparisonsService.getComparisons();

    const nav = `<a href="/">Home</a>`;
    const table = `<h1>There are ${comparisons.length} comparisons in the database</h1><table><thead><tr><th>User 1</th><th>User 2</th><th>Common beers</th><th>See comparison</th></tr></thead><tbody>`;
    const beerRows = comparisons.map(comp => `<tr><td>${comp.untappdUsers[0]}</td><td>${comp.untappdUsers[1]}</td><td>${comp.commonBeers.length}</td><td><a href="/comparisons/${comp._id}">Click here</a></td></tr>`);
    const html = `${nav}${table}${beerRows.join('')}</tbody></table>`;

    response.send(html);
});

// Request a new comparison, requires authorization, redirects to a comparison page
comparisonsSsrRouter.post('/', helper.authenticateToken, async (request, response) => {
    const { user1, user2 } = request.body;
    const requestedComparison = await comparisonsService.requestComparison(user1, user2);

    response.redirect(`/comparisons/${requestedComparison._id}`);
});

// Redirect to user's saved comparisons route
comparisonsSsrRouter.get('/users', helper.authenticateToken, async (request, response) => {
    const userID = request.user.id

    response.redirect(`/comparisons/users/${userID}`)
})

// View comparisons saved by a user
comparisonsSsrRouter.get('/users/:user_id', helper.authenticateToken, async (request, response) => {
    const comparisons = await comparisonsService.getUserComparisons(request.params.user_id);
    const user = request.user;

    const nav = `<a href="/">Home</a>`;
    const table = `<h1>There are ${comparisons.length} comparisons saved by ${user.username}</h1><table><thead><tr><th>User 1</th><th>User 2</th><th>Common beers</th><th>See comparison</th></tr></thead><tbody>`;
    const beerRows = comparisons.map(comp => `<tr><td>${comp.untappdUsers[0]}</td><td>${comp.untappdUsers[1]}</td><td>${comp.commonBeers.length}</td><td><a href="/comparisons/${comp._id}">Click here</a></td></tr>`);
    const html = `${nav}${table}${beerRows.join('')}</tbody></table>`;

    response.send(html);
});

// View a specific comparison, requires authorization
comparisonsSsrRouter.get('/:comp_id', helper.authenticateToken, async (request, response) => {
    const comparison = await comparisonsService.getComparison(request.params.comp_id)
    const userId = request.user.id;

    const nav = `<a href="/">Home</a>`;
    const greeting = `<p>${comparison.untappdUsers[0]} and ${comparison.untappdUsers[1]} have ${comparison.commonBeers.length} beers in common:</p><ul>`;
    const beers = comparison.commonBeers.map(beer => `<li>${beer.beer_name}</li>`);
    const saveComparison = (comparison.users.includes(userId))
        ? '<p>You already saved this comparison</p>'
        : `<form method="post" action="/comparisons/${comparison._id}"><button name="save">Save comparison</button></form>`;
    const myComparisons = `<a href="/comparisons/users/${userId}">My Comparisons</a>`;

    const html = `${nav}${greeting}<ul>${beers.join('')}</ul>${saveComparison}${myComparisons}`;

    response.send(html);
});

// Save a comparison as a user, requires authorization
comparisonsSsrRouter.post('/:comp_id', helper.authenticateToken, async (request, response) => {
    const comparison = await comparisonsService.saveComparison(request.params.comp_id, request.user.id)

    response.redirect(`/comparisons/${comparison._id}`);
});

module.exports = comparisonsSsrRouter;