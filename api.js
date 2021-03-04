const fetch = require('node-fetch');

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

    const emptyUrls = new Array(numberOfQueries).fill({});

    const fetchUrls = emptyUrls.map((_, index) => {
        const offset = index * limit;
        const newUrl = generateQueryUrl(username, limit, offset);
        return newUrl;
    })

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

module.exports = userBeerFetch;