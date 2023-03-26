const User = require('../model/User');

const handleLogOut = async (req, res) => {
    const cookies = req.cookies;
    if (cookies?.jwt) return res.sendStatus(204); // No content  to return
    const refreshToken = cookies.jwt;

    // Is refresh Token in db?

    const foundUser = await User.findOne({ refreshToken }).exec();
    if (!foundUser) {
        res.clearCookie('jwt', { httpOnly: true });
        return res.sendStatus(204);
    }

    //delete the refresh token in the database.
    foundUser.refreshToken = foundUser.refreshToken.filter(rt => rt !== refreshToken);
    ;
    const result = await foundUser.save();
    console.log(result);
    
    res.clearCookie('jwt', { httpOnly: true, sameSite: none, secure: true });//secure true : serves only on https
    return res.sendStatus(204);

}

module.exports = { handleLogOut };