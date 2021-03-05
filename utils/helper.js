const getTokenFrom = request => {
    const token = request.cookies.token
    if (token && token.toLowerCase().startsWith('bearer ')) {
        return token.substring(7)
    }
    return null
}

module.exports = { getTokenFrom }