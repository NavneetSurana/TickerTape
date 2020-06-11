const dbName= "tickerTape";
const user = "admin";
const pass = "password";
const url = `mongodb://${user}:${pass}@localhost:27017/`;

module.exports = {
	dbName,
	user,
	pass,
	url,
};
