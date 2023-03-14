const userDB = {
    users: require('../model/users.json'),
    setUsers: function (data) { this.users = data }
}

const path = require('path');
const bcrypt = require('bcrypt');
const fs = require('fs');
const fsPromises = require('fs').promises

const jwt = require('jsonwebtoken');
require('dotenv').config();

const loginHandle = async (req, res) => {
    const { user, pwd } = req.body;

    if (!user || !pwd) { res.sendStatus(401).json({ "message": `username and password are required` }) }

    //find user
    const foundUser = userDB.users.find(person => person.username === user);
    if (!foundUser) res.sendStatus(401);// unauthprized

    // verify password
    const match = await bcrypt.compare(pwd, foundUser.password);
    if (match) {
        const roles = Object.values(foundUser.roles);

        //create JWTs
        const accessToken = jwt.sign(
            {
                "userInfo": {
                    "username":
                        foundUser.username,
                    "roles": roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '30s' }
        )
        const refreshToken = jwt.sign(
            { "username": foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        )

        //storing refresh token with the current user.
        const otherUsers = userDB.users.filter(person => person.username !== foundUser.username);
        const currentUser = { ...foundUser, refreshToken };
        userDB.setUsers([...otherUsers, currentUser]);

        await fsPromises.writeFile(
            path.join(__dirname, '..', 'model', 'users.json'),
            JSON.stringify(userDB.users)
        )
        res.cookie('jwt', refreshToken, { httpOnly: true, secure: true, maxAge: 24 * 60 * 60 * 1000 })
        res.status(200).json({ accessToken })

    } else { return res.sendStatus(401) }
    // res.sendStatus(200).json({"success":`user ${user} successfully loged in`})
}

module.exports = { loginHandle };

