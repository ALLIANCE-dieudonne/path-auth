const User = require('../model/User');
const bcrypt = require('bcrypt');
const fs = require('fs');
const fsPromises = require('fs').promises

const jwt = require('jsonwebtoken');

const loginHandle = async (req, res) => {

    const cookie = req.cookies;
    const { user, pwd } = req.body;

    if (!user || !pwd) { res.status(400).json({ "message": `username and password are required` }) }

    //find user
    const foundUser = await User.findOne({ username: user }).exec();
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
        const newRefreshToken = jwt.sign(
            { "username": foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );

        let newRefreshTokenArray =
            !cookies?.jwt
                ? foundUser.refreshToken
                : foundUser.refreshToken.filter(rt => rt !== cookies.jwt);

        if (cookies?.jwt) {

            const refreshToken = cookies.jwt;
            const foundToken = await User.findOne({ refreshToken }).exec();

            //Detection of refresh token reuse
            if (!foundToken) {
                console.log(`Attempted refresh token reuse at login`);

                //clear all previous refresh tokens in the array
                newRefreshTokenArray = [];
            }
            res.clearCookie('jwt', { httpOnly: true, sameSite: none, secure: true })//secure true : serves only on https

        }
        //storing refresh token with the current user.
        foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
        const result = await foundUser.save();
        console.log(result);

        //Create Secure Cookie with refresh token
        res.cookie('jwt', newRefreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });

        //Send authorisation roles and access token to the use
        res.status(200).json({ accessToken })

    } else { return res.sendStatus(401) }
    // res.sendStatus(200).json({"success":`user ${user} successfully loged in`})
}

module.exports = { loginHandle };

