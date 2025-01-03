const express = require('express');
const { query } = require('express-validator');
const db = require('../db/db.js');
const { getHighestBidValue } = require('../utils/bids-validity-utils.js');
const { isAfter } = require('../utils/time-utils.js');
const router = express.Router();

/* Elenco degli utenti, si può filtrare con il parametro q */
router.get("/", query('q').trim().escape(), async (req, res) => {
    try {
        const mongo = await db.connect2db();
        const users_list = await mongo.collection("users").find({}, { projection: { _id: 0 } }).toArray();
        if(!req.query.q) {
            return res.status(200).json(users_list);
        } else {
            const query = req.query.q;
            const regex_query = new RegExp(`${query}`, "i", "g");
            const filtered_list = users_list.filter(u => regex_query.test(u.username) || regex_query.test(u.name) || regex_query.test(u.surname));
            if(filtered_list.length === 0) {
                return res.status(404).json({ msg: 'No user found.' });
            }
            return res.status(200).json(filtered_list);
        }
    } catch(error) {
        console.error("Error.", error);
        return res.status(500).json({ error: 'Internal error' });
    }
});

/* Dettagli dell’utente con identificativo id */
router.get("/:id", async (req, res) => {
    const paramID = parseInt(req.params.id);
    const won_auctions = [];
    try {
        const mongo = await db.connect2db();
        const requested_user = await mongo.collection("users").findOne({ userId : paramID });
        if(!requested_user) {
            return res.status(404).json({ msg: 'No user found.' });
        }
        const auctions_not_owned = await mongo.collection("auctions").find({ user: { $ne: paramID } }).toArray();
        const expiredAuctions = auctions_not_owned.filter(a => !isAfter(a.closingDate));
        expiredAuctions.forEach(element => {
            let highest = getHighestBidValue(element.bids, element.initialValue); 
            const singleBid = element.bids.find(b => b.userId === paramID);
            if(singleBid && singleBid.value === highest) {
                let won = {
                    auction: {
                        title: element.title,
                        description: element.description,
                        closingDate: element.closingDate,
                        initialValue: element.initialValue
                    },
                    bid: highest,
                };
                won_auctions.push(won);
            }   
        });
        return res.status(200).json({
            requested_user: requested_user,
            won_auctions: won_auctions
        });
    } catch(error) {
        console.error("Error.", error);
        return res.status(500).json({ error: 'Internal error' });
    }
});

module.exports = router;