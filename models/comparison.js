const mongoose = require('mongoose')

const comparisonSchema = new mongoose.Schema({
    untappdUsers: [String],
    commonBeers: [],
    date: Date,
})

module.exports = mongoose.model('Comparison', comparisonSchema)