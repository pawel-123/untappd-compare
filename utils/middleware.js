const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }

  if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'invalid token' });
  }

  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' });
  }

  next(error);
};

module.exports = { unknownEndpoint, errorHandler };