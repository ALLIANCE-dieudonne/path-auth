const User = require('../model/User');
const jwt = require('jsonwebtoken');

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;

    if (!cookies?.jwt) { res.sendStatus(401) } //unauthorised

    console.log(cookies.jwt);
    const refreshToken = cookies.jwt;
    res.clearCookie('jwt', { httpOnly: true, sameSite: none, secure: true });//secure true : serves only on https

    const foundUser = await User.findOne({ refreshToken }).exec();
    //Dtect refresh token reuse

    if (!foundUser) {
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            async (err, decoded) => {
                if (err) return res.sendStatus(403);//forbidden
                const hackedUser = await User.findOne({ username: decoded.username }).exec();
                hackedUser.refreshToken = [];
                const result = await hackedUser.save();
                console.log(result);

            })

        return res.sendStatus(403);// forbidden
    }

    const newRefreshTokenArray = foundUser.refreshToken.filter(rt => rt !== refreshToken);

    // verify jwt
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decoded) => {
            if (err) {
                foundUser.refreshToken = [...newRefreshTokenArray];
                const result = foundUser.save();
            }
            if (err || foundUser.username !== decoded.username) {
                console.log(err.message);
                return res.json({ status: 403, message: err.message, success: false })
            }
            //Refesh token was still valid
            const roles = Object.values(foundUser.roles);
            const accessToken = jwt.sign(
                {
                    "userInfo": {
                        "username": decoded.username,
                        "roles": roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '30s' }
            );

            const newRefreshToken = jwt.sign(
                { "username": foundUser.username },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: '1d' }
            )
    
            //storing refresh token with the current user.
            foundUser.refreshToken = [...newRefreshTokenArray,newRefreshToken];
            const result = await foundUser.save();

             //Create Secure Cookie with refresh token
        res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });

        res.json({ accessToken })
        }
    )

}
module.exports = { handleRefreshToken };

