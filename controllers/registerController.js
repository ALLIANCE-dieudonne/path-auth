const userDB = {
    users: require('../model/users.json'),
    setUsers: function (data) { this.users = data }
}
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
    const duplicate = userDB.users.find(person => person.username === user);
    if (duplicate) return res.sendStatus(409);

    try {
        const hashedpwd = await bcrypt.hash(pwd, 10);
        const newUser = {
            "username": user,
            "roles": { "user": 2001 },
            "password": hashedpwd
        };
        userDB.setUsers([...userDB.users, newUser]);

        await fsPromises.writeFile(
            path.join(__dirname, '..', 'model', 'users.json'),
            JSON.stringify(userDB.users)
        )
        // console.log(userDB.users);
        res.status(200).json({ "success": `the user ${user} has been succefully created` })

    } catch (err) { res.json({ "message": err.message }) }
}

module.exports = { handleNewUser };