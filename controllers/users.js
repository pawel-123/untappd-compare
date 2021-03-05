const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const path = require('path');
const User = require('../models/user')

const options = {
    root: path.join(__dirname, '../'),
};

usersRouter.get('/', async (request, response) => {
    const tokenCookie = request.cookies.token
    let token = null

    if (tokenCookie && tokenCookie.toLowerCase().startsWith('bearer ')) {
        token = tokenCookie.substring(7)
    }

    if (!token) {
        response.status(401).json({ error: 'token missing' })
    }

    const users = await User.find({})

    response.json(users)
})

usersRouter.get('/register', async (request, response) => {
    response.sendFile('/register.html', options)
})

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