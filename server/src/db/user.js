const client = require("./DBHandler");
const conf = require("../js/config");

module.exports = {
	createCollections: async () => {
		const DBHandler = new client();
		try {
			await DBHandler.connect(conf.userDB);
			const db = DBHandler.get();
			const collection = db.collection("userInfo");
			await collection.createIndexes([
				{ key: { phone: 1 } },
				{ key: { email: 1 }, unique: true },
			]);
		} catch (err) {
			console.error(err);
		} finally {
			await DBHandler.close();
		}
	},
	create: async (user) => {
		let res = {};
		const DBHandler = new client();
		try {
			if (Object.keys(user).length === 0) throw "empty query";
			await DBHandler.connect(conf.userDB);
			const db = DBHandler.get();
			const collection = db.collection("userInfo");
			await collection.insertOne(user);
			res.code = 0;
		} catch (err) {
			console.error(err);
			res.code = 1;
		} finally {
			await DBHandler.close();
			return res;
		}
	},
	update: async (user) => {
		let res = {};
		const DBHandler = new client();
		try {
			if (Object.keys(user).length === 0) throw "empty query";
			await DBHandler.connect(conf.userDB);
			const db = DBHandler.get();
			const collection = db.collection("userInfo");
			await collection.updateOne(
				{ _id: user._id },
				{
					$set: user,
				},
				{
					upsert: false,
				}
			);
			res.code = 0;
		} catch (err) {
			console.error(err);
			res.code = 1;
		} finally {
			await DBHandler.close();
			return res;
		}
	},
	read: async (query) => {
		let res = {};
		const DBHandler = new client();
		try {
			if (Object.keys(query).length === 0) throw "empty query";
			await DBHandler.connect(conf.userDB);
			const db = DBHandler.get();
			const collection = db.collection("userInfo");
			res.data = await collection.findOne(query);
			res.code = 0;
		} catch (err) {
			console.error(err);
			res.code = 1;
		} finally {
			await DBHandler.close();
			return res;
		}
	},
	delete: async (query) => {
		let res = {};
		const DBHandler = new client();
		try {
			if (Object.keys(query).length === 0) throw "empty query";
			await DBHandler.connect(conf.userDB);
			const db = DBHandler.get();
			const collection = db.collection("userInfo");
			await collection.deleteOne(query);
			res.code = 0;
		} catch (err) {
			console.error(err);
			res.code = 1;
		} finally {
			await DBHandler.close();
			return res;
		}
	},
};
