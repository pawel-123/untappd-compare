const express = require('express');
const app = express();
const fetch = require('node-fetch');
const path = require('path');
require('dotenv').config();

const generateQueryUrl = (username, limit, offset = 0) => {
    const startDate = '2020-11-01';
    const endDate = '2020-12-31';
    const queryUrl = `https://api.untappd.com/v4/user/beers/${username}?limit=${limit}&start_date=${startDate}&end_date=${endDate}&offset=${offset}&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}`
    return queryUrl;
}

// fetch unique beers of an Untappd user
const userBeerFetch = async (username, limit = 50) => {
    const queryUrl = generateQueryUrl(username, limit);
    const response = await fetch(queryUrl);
    const data = await response.json();

    const totalCount = data.response.total_count;
    console.log(`total number of results for ${username}: ${totalCount}`);
    const numberOfQueries = Math.ceil(totalCount / limit);
    console.log(numberOfQueries);

    const emptyUrls = new Array(numberOfQueries).fill({});

    const fetchUrls = emptyUrls.map((_, index) => {
        const offset = index * limit;
        const newUrl = generateQueryUrl(username, limit, offset);
        return newUrl;
    })

    console.log('array of fetchUrls for ${username}:', fetchUrls);

    // convert fetchUrls to requests
    const requests = fetchUrls.map(url => fetch(url));

    // fetch data for each url, convert to json
    // and combine into a flat array of userCheckins
    const fullResponse = await Promise.all(requests);
    const fullData = await Promise.all(fullResponse.map(j => j.json()));
    const userCheckins = fullData.reduce((arr, resp) => {
        arr.push(resp.response.beers.items)
        return arr;
    }, []).flat();

    console.log(`userCheckins length for ${username}: ${userCheckins.length}`);

    // extract beer id, name and rating into a userBeers object 
    const userBeers = await userCheckins.reduce((obj, checkin) => {
        let beer = {
            beer_id: checkin.beer.bid,
            beer_name: checkin.beer.beer_name,
            beer_rating: checkin.rating_score
        }
        obj[checkin.beer.bid] = beer;
        return obj;
    }, {});

    return userBeers;
};

const compareBeers = async (user1, user2) => {

    // fetch beers for user1 and user2
    const user1Beers = await userBeerFetch(user1);
    const user2Beers = await userBeerFetch(user2);

    // find common beers between user1 and user2
    // and create commonBeers - an array of objects
    const commonBeers = await Object.keys(user1Beers).reduce((arr, beer) => {
        if (Object.keys(user2Beers).includes(beer)) {
            let commonBeer = {
                beer_id: beer,
                beer_name: user1Beers[beer]['beer_name'],
                user1_rating: user1Beers[beer]['beer_rating'],
                user2_rating: user2Beers[beer]['beer_rating']
            }
            arr.push(commonBeer);
        }
        return arr;
    }, []);

    // calculate the averate ratings for each user based on commonBeers
    const averageRatings = await commonBeers.reduce((obj, beer) => {
        obj['user1_average'] += beer['user1_rating'] / commonBeers.length;
        obj['user2_average'] += beer['user2_rating'] / commonBeers.length;
        return obj;
    }, { 'user1_average': 0, 'user2_average': 0 });

    console.log(`${user1} (average rating: ${averageRatings['user1_average']})`)
    console.log(`${user2} (average rating: ${averageRatings['user2_average']})`)
    console.log(`users have ${commonBeers.length} beers in common`);
    console.log(commonBeers);

    return commonBeers;
}

const options = {
    root: path.join(__dirname, '/')
}

app.get('/', (request, response) => {
    response.sendFile('/index.html', options);
});

app.get('/results', async (request, response) => {
    const user1 = request.query.user1;
    const user2 = request.query.user2;
    const commonBeers = await compareBeers(user1, user2);
    let beerHtml = `<p>${user1} and ${user2} have ${commonBeers.length} beers in common:</p><ul>`;
    commonBeers.forEach(beer => {
        beerHtml += `<li>${beer.beer_name}</li>`
    })
    beerHtml += '</ul>';
    response.send(beerHtml);
});

const PORT = 3002;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});