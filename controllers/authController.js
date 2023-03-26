const User = require('../model/User');
const bcrypt = require('bcrypt');
const fs = require('fs');
const fsPromises = require('fs').promises

const jwt = require('jsonwebtoken');

const loginHandle = async (req, res) => {
    const { user, pwd } = req.body;

    if (!user || !pwd) { res.status(400).json({ "message": `username and password are required` }) }

    //find user
    const foundUser = await User.findOne({username : user}).exec();
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
            { expiresIn: '1d' }
        )
        const refreshToken = jwt.sign(
            { "username": foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        )

        //storing refresh token with the current user.
        foundUser.refreshToken = refreshToken;
        const result = await foundUser.save();
        console.log(result);
        res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
        res.status(200).json({ accessToken })

    } else { return res.sendStatus(401) }
    // res.sendStatus(200).json({"success":`user ${user} successfully loged in`})
}

module.exports = { loginHandle };

