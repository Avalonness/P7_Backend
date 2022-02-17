const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');

let auth = (req, res, next) =>
{
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, config.secret);
        const userId = decodedToken.userId;
        if (req.body.userId && req.body.userId !== userId) {
          throw 'Invalid user ID';
        } else {
          next();
        }
    }

    catch {
        res.status(401).json("Requête non authentifié !")
    }
};
module.exports = auth  