const comparisonsApiRouter = require('express').Router();
const Comparison = require('../models/comparison');
const User = require('../models/user');
const comparisonsService = require('../services/comparisonsService');
const helper = require('../utils/helper');
const compareBeers = require('../compareBeers');

// View all comparisons
comparisonsApiRouter.get('/', helper.authenticateToken, async (request, response) => {
    const comparisons = await comparisonsService.getComparisons();

    response.json(comparisons);
});

// Request a new comparison, requires authorization
comparisonsApiRouter.post('/', helper.authenticateToken, async (request, response) => {
    const { user1, user2 } = request.body;
    const requestedComparison = await comparisonsService.requestComparison(user1, user2);

    response.json(requestedComparison);
});

// View a specific comparison, requires authorization
comparisonsApiRouter.get('/:comp_id', helper.authenticateToken, async (request, response) => {
    const comparison = await comparisonsService.getComparison(request.params.comp_id)

    response.json(comparison);
});

// Save a comparison as a user, requires authorization
comparisonsApiRouter.post('/:comp_id', helper.authenticateToken, async (request, response) => {
    const comparison = await comparisonsService.saveComparison(request.params.comp_id, request.user.id)

    response.json(comparison);
});

// View comparisons saved by a user
comparisonsApiRouter.get('/users/:user_id', helper.authenticateToken, async (request, response) => {
    const comparisons = await comparisonsService.getUserComparisons(request.params.user_id);

    response.json(comparisons);
});

module.exports = comparisonsApiRouter;