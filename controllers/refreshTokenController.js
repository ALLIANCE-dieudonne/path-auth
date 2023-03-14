const userDB = {
    users: require('../model/users.json'),
    setUsers: function (data) { this.users = data }
}


const jwt = require('jsonwebtoken');
require('dotenv').config();

const handleRefreshToken = (req, res) => {
    const cookies = req.cookies;

    if (!cookies?.jwt) { res.sendStatus(401) } //unauthorised

    console.log(cookies.jwt);
    const refreshToken = cookies.jwt;


    const foundUser = userDB.users.find(person => person.refreshToken === refreshToken);
    if (!foundUser) res.sendStatus(403);// forbidden

    // verify jwt
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || foundUser.username !== decoded.username) {
                console.log(err.message);
                return res.json({ status: 403, message: err.message, success: false })
            }
            const roles = Object.values(foundUser.roles);
            const accessToken = jwt.sign(
              {  "userInfo": {
                    "username":
                        foundUser.username,
                    "roles": roles
                }},
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '30s' }
            );
            res.json({ accessToken })
        }
    )

}
module.exports = { handleRefreshToken };

