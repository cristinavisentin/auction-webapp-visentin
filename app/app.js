const express = require('express');
const  cookieParser = require('cookie-parser');

const users = require('./routes/users.js');
const auth = require('./routes/auth.js');
const auctions = require('./routes/auctions.js');
const bids = require('./routes/bids.js');
const whoami = require('./routes/whoami.js');

const PORT = 3000;

const app = express();
app.use(cookieParser());
app.use(express.json());

app.use('/api/auth', auth);
app.use('/api/auctions', auctions);
app.use('/api/users', users);
app.use('/api/bids', bids);
app.use('/api/whoami', whoami);

app.use(express.static('public'));

app.listen(PORT, () => {
    console.log("Server is active");
});