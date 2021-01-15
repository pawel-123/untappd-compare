const fetch = require('node-fetch');
const userBeerFetch = require('./api');

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

module.exports = compareBeers;