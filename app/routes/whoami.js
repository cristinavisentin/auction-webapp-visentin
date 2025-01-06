const express = require('express');
const db = require('../db/db.js');
const { validateToken } = require('../utils/token-utils.js');
const router = express.Router();

/* Se autenticato, restituisce le informazioni sull’utente */
router.get("/", validateToken, async (req, res) => {
    const reqUSER = parseInt(req.userId);
    try {
        const mongo = await db.connect2db();
        const myself = await mongo.collection("users").findOne({ userId: reqUSER });
        const myAuctions = await mongo.collection("auctions").find({ user: reqUSER }).toArray();
        return res.status(200).json({
            myself: myself,
            myAuctions: myAuctions
        });
    } catch(error) {
        console.error("Error.", error);
        return res.status(500).json({ error: 'Internal error' });
    }
});

module.exports = router;