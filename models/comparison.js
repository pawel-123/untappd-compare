const mongoose = require('mongoose')

const comparisonSchema = new mongoose.Schema({
    untappdUsers: {
        type: [String],
        minLength: 2,
        maxLength: 2,
    },
    commonBeers: [],
    date: Date,
    users: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
})

comparisonSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Comparison', comparisonSchema)