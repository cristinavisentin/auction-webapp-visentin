const bcrypt = require('bcryptjs');
const db = require('../db/db.js');

const saltRounds = 5;

const hashPassword = async (password) => {
	return await bcrypt.hash(password, saltRounds);
};

const validateUserCredentials = async (username, password) => {
  	const mongo = await db.connect2db();
  	const db_user = await mongo.collection("users").findOne({ username });
  	if(!db_user) {
		throw new Error("user not found.");
  	}
  	const match = await bcrypt.compare(password, db_user.password);
  	if(!match) {
		throw new Error("password mismatch.");
  	}
	const data = { 
		id: db_user.userId,
		username: db_user.username
	};
  	return data;
};

module.exports = { hashPassword, validateUserCredentials };
