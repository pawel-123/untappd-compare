const jwt = require('jsonwebtoken');

const getTokenFrom = request => {
    const token = request.cookies.token;
    if (token && token.toLowerCase().startsWith('bearer ')) {
        return token.substring(7);
    }
    return null;
};

const authenticateToken = (request, response, next) => {
    const tokenCookie = request.cookies.token
    const token = tokenCookie && tokenCookie.substring(7);
    if (!token) {
        return response.status(401).json({ error: 'token missing or invalid (via authenticateToken)' });
    }

    jwt.verify(token, process.env.SECRET, (error, user) => {
        if (error) {
            return response.status(403).json({ error: 'jwt not verified via authenticateToken' })
        }
        next()
    })
}

module.exports = { getTokenFrom, authenticateToken };