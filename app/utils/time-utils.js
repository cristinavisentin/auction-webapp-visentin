const isBefore = (dateBefore, dateAfter) => {
    const dBef = new Date(dateBefore);
    const dAft = new Date(dateAfter);
    return dBef < dAft;
};

const isAfter = (closingDate) => {
    return closingDate > new Date()
};

module.exports = { isBefore, isAfter };