const jwt = require('jsonwebtoken');
const SECRET_KEY = 'nuova_passkey_'

const generateToken = (payload) => {
    const options = {
        expiresIn: '1h',
    };
    const token = jwt.sign( 
        payload, 
        SECRET_KEY, 
        options);
    return token;
};

const validateToken = (req, res, next) => {
    const token = req.cookies['token'];
    if(token) {
        try {
            const decoded = jwt.verify(token, SECRET_KEY);
            req.userId = decoded.id;
            req.username = decoded.username;
            next();
        } catch(error) {
            return res.status(403).json({ msg: 'Forbidden: invalid token' });
        }
    } else {
        return res.status(401).json({ msg: 'Unauthorized: token not provided or expired' });
    }
};

module.exports = { generateToken, validateToken };