const isValid = (lastValue, newValue) => {
    return newValue > lastValue;
};

const getHighestBidValue = (bids, initialValue) => {
    if(!bids || bids.length === 0) {
        return parseFloat(initialValue);
    }
    return bids.reduce((max, bid) => Math.max(max, parseFloat(bid.value)), parseFloat(initialValue));
};

module.exports = { isValid, getHighestBidValue };