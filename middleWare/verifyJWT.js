const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyJWT = (req, res, next) => {
    // console.log(req.headers);
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader?.startWith('Bearer ')) { return res.sendStatus(401); }
    const token = authHeader.split(' ')[1];

    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) {
                console.log(err.message);
                return res.json({ status: 403, message: err.message, success: false })
            }
            else {
                req.user = decoded.userInfo.username
                req.roles = decoded.userInfo.roles
                next();
            }
        }
    )
}

module.exports = verifyJWT;