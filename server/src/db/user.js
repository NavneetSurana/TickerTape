const client = require("./DBHandler");
const conf = require("../js/config");

module.exports = {
	
	create: async (user) => {
		let res = {};
		const DBHandler = new client();
		try {
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
	read: async (username) => {
		let res = {};
		const DBHandler = new client();
		try {
			await DBHandler.connect(conf.userDB);
			const db = DBHandler.get();
			const collection = db.collection("userInfo");
			res.data = await collection.findOne({ _id: username });
			res.code = 0;
		} catch (err) {
			console.error(err);
			res.code = 1;
		} finally {
			await DBHandler.close();
			return res;
		}
	},
	delete: async (username) => {
		let res = {};
		const DBHandler = new client();
		try {
			await DBHandler.connect(conf.userDB);
			const db = DBHandler.get();
			const collection = db.collection("userInfo");
			await collection.deleteOne({ _id: username });
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
