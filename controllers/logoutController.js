const userDB = {
    users: require('../model/users.json'),
    setUsers: function (data) { this.users = data }
}

const fsPromises = require('fs').promises;
const path = require('path');

const handleLogOut = async (req, res) => {
    const cookies = req.cookies;
    if (cookies?.jwt) return res.sendStatus(204); // No content  to return
    const refreshToken = cookies.jwt;

    // Is refresh Token in db?

    const foundUser = userDB.users.find(person => person.refreshToken = refreshToken);
    if (!foundUser) {
        res.clearCookie('jwt', { httpOnly: true });
        return res.sendStatus(204);
    }

    //delete the refresh token in the database.
    const otherUsers = userDB.users.filter(person => person.refreshToken !== foundUser);
    const currentUser = { ...foundUser, refreshToken: '' };
    userDB.setUsers([...otherUsers, currentUser]);

    await fsPromises.writeFile(
        path.join(__dirname, '..', 'model', 'users.json'),
        JSON.stringify(userDB.users)
    )
    res.clearCookie('jwt', { httpOnly: true, sameSite: none, secure: true });//secure true : serves only on https
    return res.sendStatus(204);

}

module.exports = { handleLogOut };