const express = require('express');
const db = require('../db/db.js');
const { generateToken } = require('../utils/token-utils.js');
const { hashPassword, validateUserCredentials } = require('../utils/hashing-utils.js');
const router = express.Router();

/* Login di un utente */
router.post("/signin", async (req, res) => {
    const { username, password } = req.body;
    try {
        const data = await validateUserCredentials(username, password);
        const token = generateToken(data);
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 60 * 60 * 1000
        });
        return res.status(200).json({ msg: 'Authentication successful' });
    } catch(error) {
        if(error.message === 'user not found.' || error.message === 'password mismatch.') {
            console.error("Error in user authentication.", error);
            return res.status(400).json({ error: 'Invalid username or password' });
        } else {
            console.error("Error.", error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    } 
});

/* Registrazione di un nuovo utente */
router.post("/signup", async (req, res) => {
    const { name, surname, username, password } = req.body;
    try{
        const mongo = await db.connect2db();
        const db_user = await mongo.collection("users").findOne({ username });
        if(db_user) {
            return res.status(409).json({ error: 'Username already exists' });
        } else {
            const lastUser = await mongo.collection("users").findOne({}, { sort: { userId: -1 } });
            let id = lastUser?.userId !== undefined ? lastUser.userId : -1;
            id++;
            const hashed_password = await hashPassword(password);
            const newUser = { userId: id, name, surname, username, password: hashed_password };
            const result = await mongo.collection("users").insertOne(newUser);
            const data = { 
                id: id,
                username: username
            };
            const token = generateToken(data);
            res.cookie('token', token, {
                httpOnly: true,
                maxAge: 60 * 60 * 1000
            });
            return res.status(200).json({ msg: 'Registration successful', result});
        }
    } catch(error) {
        console.error("Error.", error);
        return res.status(500).json({ error: 'Internal error' });
    }
});

module.exports = router;