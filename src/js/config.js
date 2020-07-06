require("dotenv").config();
module.exports = {
	dbName: process.env.DB_NAME,
	user: process.env.DB_USER,
	pass: process.env.DB_PASSWORD,
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	url: process.env.DB_URL,
	EquityMeta: process.env.EquityMeta,
	backupPath: process.env.DB_BACKUP_PATH,
	authDb: process.env.AUTH_DB,
};
