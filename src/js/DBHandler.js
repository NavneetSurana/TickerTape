const MongoClient = require("mongodb").MongoClient;
const conf = require("./config");
class DBHandler {
	constructor() {
		this.client = new MongoClient(conf.url, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
	}
	connect = async () => {
		try {
			if (this.client.isConnected()) console.log("already connected");
			else {
				await this.client.connect();
				console.log("connection established");
				this.db = this.client.db(conf.dbName);
			}
		} catch (err) {
			console.log(err);
		}
	};
	get() {
		if (this.client.isConnected()) return this.db;
		else console.log("connection not established");
	}
	async close() {
		delete this.db;
		await this.client.close();
		console.log("connection closed");
	}
}
module.exports = DBHandler;
