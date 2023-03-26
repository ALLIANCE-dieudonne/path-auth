const User = require('../model/User');
const fs = require('fs');
const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const fsPromises = require('fs').promises;

const handleNewUser = async (req, res) => {
    const { user, pwd } = req.body;
    if (!user || !pwd) {
        res.sendStatus(401).json({ "message": "User name and password are required" })
    }
    const duplicate = await User.findOne({username : user}).exec();
    if (duplicate) return res.sendStatus(409);

    try {

        //encrypt the password
        const hashedpwd = await bcrypt.hash(pwd, 10);
        //create and store new user
        const result = await User.create({
            "username": user,
            "password": hashedpwd
        });

        console.log(result);
        
        res.status(200).json({ "success": `the user ${user} has been succefully created` })

    } catch (err) { res.json({ "message": err.message }) }
}

module.exports = { handleNewUser };