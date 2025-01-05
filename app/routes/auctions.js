const express = require('express');
const db = require('../db/db.js');
const { query, body } = require('express-validator');
const { validateToken } = require('../utils/token-utils.js');
const { isBefore, isAfter } = require('../utils/time-utils.js');
const { isValid, getHighestBidValue } = require('../utils/bids-validity-utils.js');
const router = express.Router();

/* Elenco di tutte le aste, si può filtrare con il parametro q */
router.get("/", query('q').trim().escape(), async (req, res) => {
    try {
        const mongo = await db.connect2db();
        const auction_list = await mongo.collection("auctions").find({}, { projection: { _id: 0} }).toArray();
        if(!req.query.q) {
            return res.status(200).json(auction_list);
        } else {
            const query = req.query.q;
            const regex_query = new RegExp(`${query}`, "i", "g");
            const filtered_list = auction_list.filter(a => regex_query.test(a.title) || regex_query.test(a.description));
            if(filtered_list.length === 0) {
                return res.status(404).json({ msg: 'No auction found.' });
            }
            return res.status(200).json(filtered_list);
        }
    } catch(error) {
        console.error("Error.", error);
        return res.status(500).json({ error: 'Internal error' });
    }
});

/* Crea una nuova asta, solo per utente autenticati */
router.post("/", 
    validateToken, 
    body('title').escape(), 
    body('description').escape(),
    async (req, res) => {
        const reqUSER = req.userId;
        let { title, description, closingDate, initialValue } = req.body;
        closingDate = new Date(closingDate);
        if(!isAfter(closingDate)) {
            return res.status(406).json({ msg: 'Past dates are not valid' });
        }
        if(!Number.isFinite(Number(initialValue)) || Number(initialValue) < 0) {
            return res.status(400).json({ msg: 'Initial value must be a positive valid number' });
        }
        initialValue = parseFloat(initialValue);
        const bids = [];
        try {
            const mongo = await db.connect2db();
            const lastAuction = await mongo.collection("auctions").findOne({}, { sort: { auctionId: -1 } });
            let id = lastAuction?.auctionId !== undefined ? lastAuction.auctionId : 0;
            id++;
            const newAuction = { 
                auctionId: id, 
                user: reqUSER, 
                title, 
                description, 
                closingDate, 
                initialValue, 
                bids: bids
            };
            const result = await mongo.collection("auctions").insertOne(newAuction);  
            return res.status(200).json({ msg: 'New auction created', result});
        } catch(error) {
            console.error("Error.", error);
            return res.status(500).json({ error: 'Internal error' });
    }
});

/* Dettagli dell'asta specifica con identificativo id */
router.get("/:id", async (req, res) => {
    const paramID = parseInt(req.params.id);
    try {
        const mongo = await db.connect2db();
        const requested_auction = await mongo.collection("auctions").findOne({ auctionId : paramID });
        if(!requested_auction) {
            return res.status(404).json({ msg: 'No auction found.' });
        }
        return res.status(200).json(requested_auction);
    } catch(error) {
        console.error("Error.", error);
        return res.status(500).json({ error: 'Internal error' });
    }
});

/* Modifica di un’asta esistente con identificativo id, previa autenticazione */
router.put("/:id", 
    validateToken, 
    body('title').escape(), 
    body('description').escape(),
    async (req, res) => {
        const paramID = parseInt(req.params.id);
        const reqUSER = parseInt(req.userId);
        try {
            const query = { auctionId: paramID, user: reqUSER };
            const mongo = await db.connect2db();
            const requested_auction = await mongo.collection("auctions").findOne(query);
            if(!requested_auction) {
                return res.status(403).json({ msg: 'Forbidden: request user is not the owner' });
            }
            requested_auction.title = req.body.title;
            requested_auction.description = req.body.description;

            const result = await mongo.collection("auctions").replaceOne(query, requested_auction);
            if(result.matchedCount === 0) {
                return res.status(404).json({ msg: 'Auction not found' });
            } 
            return res.status(200).json({ msg: 'Auction successfully modified' });
        } catch(error) {
            console.error("Error.", error);
            return res.status(500).json({ error: 'Internal error' });
    }
});

/* Elimina un’asta esistente con identificativo id, solo il creatore dell’asta può */
router.delete("/:id", validateToken, async (req, res) => {
    const paramID = parseInt(req.params.id);
    const reqUSER = parseInt(req.userId);
    try {
        const mongo = await db.connect2db();
        const requested_auction = await mongo.collection("auctions").findOne({ auctionId : paramID });
        if(requested_auction.user === reqUSER) {
            const result = await mongo.collection("auctions").deleteOne(requested_auction);
            return res.status(200).json({ msg: 'Auction successfully deleted', result });
        } else {
            return res.status(403).json({ msg: 'Forbidden: request user is not the owner' });
        }
    } catch(error) {
        console.error("Error.", error);
        return res.status(500).json({ error: 'Internal error' });
    }
});

/* Elenco delle offerte per l’asta con identificativo id */
router.get("/:id/bids", async (req, res) => {
    const paramID = parseInt(req.params.id);
    try {
        const mongo = await db.connect2db();
        const requested_auction = await mongo.collection("auctions").findOne({ auctionId: paramID });
        if(!requested_auction) {
            return res.status(404).json({ msg: 'No auction found.' });
        }
        return res.status(200).json(requested_auction.bids);
    } catch(error) {
        console.error("Error.", error);
        return res.status(500).json({ error: 'Internal error' });
    }
});

/* Nuova offerta per l’asta con identificativo id, previa autenticazione */
router.post("/:id/bids", validateToken, async (req, res) => {
    const { submittedValue } = req.body;
    if(!Number.isFinite(Number(submittedValue)) || Number(submittedValue) < 0) {
        return res.status(400).json({ msg: 'Bid value must be a positive valid number' });
    }
    const value = parseFloat(submittedValue);
    const reqUSERID = parseInt(req.userId);
    const reqUSERNAME = req.username;
    let date = new Date();
    const query = { auctionId: parseInt(req.params.id) };
    try {
        const mongo = await db.connect2db();
        const requested_auction = await mongo.collection("auctions").findOne(query);
        if(!requested_auction || !isBefore(date, requested_auction.closingDate)) {
            return res.status(404).json({ msg: 'No auction found or auction expired.' });
        }
        if(requested_auction.user === reqUSERID) {
            return res.status(409).json({ msg: 'Forbidden: request user is the owner' });
        }
        const highestBidValue = getHighestBidValue(requested_auction.bids, requested_auction.initialValue);
        if(isValid(highestBidValue, value) === false) {
            return res.status(400).json({ msg: 'The bid amount must be higher than the current bid.' });
        }
        let lastBid = 0;
        if(requested_auction.bids && requested_auction.bids.length > 0) {
            lastBid = requested_auction.bids[requested_auction.bids.length - 1].bidId;
        }
        const new_bid = { 
            bidId: lastBid + 1, 
            userId: reqUSERID, 
            username: reqUSERNAME,
            offerDate: date, 
            value: value 
        };
        const result = await mongo.collection("auctions").updateOne(query, { $push: { bids: new_bid } });
        if(result.modifiedCount === 0) {
            throw new Error("error in adding new bid");
        }
        return res.status(200).json({ msg: 'Auction successfully modified' });
    } catch(error) {
        console.error("Error.", error);
        return res.status(500).json({ error: 'Internal error' });
    }
});

module.exports = router;