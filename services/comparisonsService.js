const Comparison = require('../models/comparison');
const User = require('../models/user');
const compareBeers = require('../compareBeers');

const getComparisons = async () => {
    const comparisons = await Comparison.find({});
    return comparisons;
}

const getUserComparisons = async (user_id) => {
    const comparisons = await Comparison.find({ users: { $in: [user_id] } });
    return comparisons;
}

const getComparison = async (id) => {
    const comparison = await Comparison.findById(id);

    if (!comparison) {
        response.status(404).json({ error: 'comparison not found' });
    }

    return comparison;
}

const requestComparison = async (user1, user2) => {
    const findComparison = (userA, userB) => Comparison.findOne({ untappdUsers: [userA, userB] });

    let requestedComparison = await findComparison(user1, user2) || await findComparison(user2, user1);

    // If there is no such comparison, it will fetch data from API, otherwise from DB
    if (!requestedComparison) {
        const commonBeers = await compareBeers(user1, user2);

        const comparison = new Comparison({
            untappdUsers: [user1, user2],
            commonBeers: commonBeers,
            date: new Date()
        });

        requestedComparison = await comparison.save();
        console.log('fetched commonBeers from Untappd and saved to database');
    } else {
        console.log('fetched commonBeers from database');
    }

    return requestedComparison;
}

const saveComparison = async (comp_id, user_id) => {
    const comparison = await Comparison.findById(comp_id);
    const user = await User.findById(user_id);

    if (!comparison.users.includes(user._id)) {
        comparison.users = comparison.users.concat(user._id);
        await comparison.save();
    }

    if (!user.savedComparisons.includes(comparison._id)) {
        user.savedComparisons = user.savedComparisons.concat(comparison._id);
        await user.save();
    }

    return comparison;
}

module.exports = { getComparisons, getUserComparisons, getComparison, requestComparison, saveComparison };