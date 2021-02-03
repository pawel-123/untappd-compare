const express = require('express');
const app = express();
const path = require('path');
require('dotenv').config();
const compareBeers = require('./compareBeers');

const options = {
  root: path.join(__dirname, '/'),
};

app.get('/', (_, response) => {
  response.sendFile('/index.html', options);
});

app.get('/results', async (request, response) => {
  const user1 = request.query.user1;
  const user2 = request.query.user2;
  const commonBeers = await compareBeers(user1, user2);

  const greeting = `<p>${user1} and ${user2} have ${commonBeers.length} beers in common:</p><ul>`;
  const beers = commonBeers.map(beer => `<li>${beer.beer_name}</li>`);

  const html = `${greeting}<ul>${beers.join()}</ul>`;
  response.send(html);
});

const PORT = 3002;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
