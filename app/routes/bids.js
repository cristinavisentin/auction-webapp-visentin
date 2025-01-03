const express = require('express');
const db = require('../db/db.js');
const router = express.Router();

/* Dettagli dell’offerta con identificativo id */
router.get("/:id", async (req, res) => {
    if(!req.query.auc_id) {
        throw new Error('No requested auction');
    }
    const queryAUCTION = parseInt(req.query.auc_id);
    const paramID = parseInt(req.params.id);
    try {
        const mongo = await db.connect2db();
        const db_auction = await mongo.collection("auctions").findOne({ auctionId: queryAUCTION });

        if(!db_auction.bids || db_auction.bids.length === 0) {
            return res.status(404).json({ msg: 'Bid not existent' });
        } else {
            return res.status(200).json(db_auction.bids[paramID - 1]);
        }
    } catch(error) {
        console.error("Error.", error);
        return res.status(500).json({ error: 'Internal error' });
    }
});

module.exports = router;