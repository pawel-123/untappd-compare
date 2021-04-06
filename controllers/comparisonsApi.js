const comparisonsApiRouter = require('express').Router();
const comparisonsService = require('../services/comparisonsService');
const helper = require('../utils/helper');

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

// Returns userID
comparisonsApiRouter.get('/users', helper.authenticateToken, async (request, response) => {
  const userID = request.user.id;

  response.json({ user_id: userID });
});

// View comparisons saved by a user
comparisonsApiRouter.get('/users/:user_id', helper.authenticateToken, async (request, response) => {
  const comparisons = await comparisonsService.getUserComparisons(request.params.user_id);

  response.json(comparisons);
});

// View a specific comparison, requires authorization
comparisonsApiRouter.get('/:comp_id', helper.authenticateToken, async (request, response) => {
  const comparison = await comparisonsService.getComparison(request.params.comp_id, response);

  response.json(comparison);
});

// Save a comparison as a user, requires authorization
comparisonsApiRouter.post('/:comp_id', helper.authenticateToken, async (request, response) => {
  const comparison = await comparisonsService.saveComparison(request.params.comp_id, request.user.id);

  response.json(comparison);
});

module.exports = comparisonsApiRouter;