const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const path = require('path');
const jwt = require('jsonwebtoken')
const helper = require('../utils/helper')
const User = require('../models/user')

const options = {
    root: path.join(__dirname, '../'),
};

// View all users, requires authorization
usersRouter.get('/', async (request, response) => {
    const token = helper.getTokenFrom(request)
    const decodedToken = jwt.verify(token, process.env.SECRET)

    if (!token || !decodedToken.id) {
        response.status(401).json({ error: 'token missing or invalid' })
    }

    const users = await User.find({})

    response.json(users)
})

// Form to register a new user
usersRouter.get('/register', async (request, response) => {
    response.sendFile('/register.html', options)
})

// Route to register a new user
usersRouter.post('/register', async (request, response) => {
    const body = request.body

    const passwordHash = await bcrypt.hash(body.password, 10)

    const user = new User({
        username: body.username,
        passwordHash
    })

    const savedUser = await user.save()

    response.json(savedUser)
})

module.exports = usersRouter