const client = require("./DBHandler");
const Info = require("./FetchEquityInfo");
const FetchEquityInfo = require("./FetchEquityInfo");
const { EquityMeta } = require("./config");
const { mapLimit, sortBy } = require("async");
const { spawnProcess } = require("./utility");
const Ploop = require("async").eachLimit;

module.exports = {
	get: async (colName, query, projection, callback = undefined) => {
		const DBHandler = new client();
		await DBHandler.connect();
		const db = DBHandler.get();
		const collection = db.collection(colName);
		const rawData = await collection.find(query).project(projection).toArray();
		await DBHandler.close();
		let data = callback ? rawData.map(callback) : rawData;
		return data;
	},
	updateEquityMeta: async () => {
		await Info.fetchMeta();
		const DBHandler = new client();
		await DBHandler.connect();
		const db = DBHandler.get();
		const collection = db.collection(EquityMeta);
		const securities = Array.from(Info.Securities, ([key, val]) =>
			val.getDetails()
		);
		try {
			await collection.createIndex({ Symbol: 1 }, { unique: true });
			await Promise.all(
				securities.map(
					async (security) =>
						await collection.updateOne(
							{ Symbol: security.Symbol },
							{
								$setOnInsert: Object.assign(security, {
									"Last Updated": new Date(),
								}),
							},
							{ upsert: true }
						)
				)
			);
			console.log(`${EquityMeta} Collection Updated`);
		} catch (err) {
			console.log(err);
		} finally {
			await DBHandler.close();
		}
	},
	getAllSymbols: async () => {
		const colName = EquityMeta;
		const query = {};
		const projection = {
			Symbol: 1,
			"Listed In NSE": 1,
			"Listed In BSE": 1,
			_id: 0,
		};
		const rawSecData = await module.exports.get(colName, query, projection);
		let Symbols = [];
		await rawSecData.map((sec) => {
			const nseFlag = sec["Listed In NSE"];
			const bseFlag = sec["Listed In BSE"];
			const Symbol = sec["Symbol"];
			let tic = [];
			if (nseFlag) Symbols.push(`${Symbol}.NS`);
			if (bseFlag) Symbols.push(`${Symbol}.BO`);
		});
		return Symbols;
	},
	newHistoryCollection: async () => {
		const colName = EquityMeta;
		const query = {};
		const projection = {
			Symbol: 1,
			"Listed In NSE": 1,
			"Listed In BSE": 1,
			_id: 0,
		};
		const rawSecData = await module.exports.get(colName, query, projection);
		let tickers = ["./src/py/yahooFinance.py"];
		await rawSecData.map((sec) => {
			const nseFlag = sec["Listed In NSE"];
			const bseFlag = sec["Listed In BSE"];
			const Symbol = sec["Symbol"];
			let tic = [];
			if (nseFlag) tickers.push(`${Symbol}.NS`);
			if (bseFlag) tickers.push(`${Symbol}.BO`);
		});
		console.log(tickers);
		await require("fs").appendFile("./errorlogs.json", tickers, (err) => {
			if (err) console.log("Error writing file:", err);
		});
		// console.log(tickers);
		// mapLimit(rawSecData, 1, async (sec) => {
		// 	const nseFlag = sec["Listed In NSE"];
		// 	const bseFlag = sec["Listed In BSE"];
		// 	const Symbol = sec["Symbol"];
		// 	await require("fs").appendFile(
		// 		"./errorlogs.json",
		// 		`${Symbol} Started\n`,
		// 		(err) => {
		// 			if (err) console.log("Error writing file:", err);
		// 		}
		// 	);
		// 	if (nseFlag) {
		// 		// let data = await FetchEquityInfo.fetchHistory(Symbol, "NSE");
		// 		// let collection = db.collection(`${Symbol}.NSE`);
		// 		// await collection.createIndex({ Date: 1 }, { unique: true });
		// 		// await collection.insertMany(data, { ordered: false });
		// 		await spawn("python3", ["./src/py/yahooFinance.py", `${Symbol}.NS`]);
		// 	}
		// 	if (bseFlag) {
		// 		// data = await FetchEquityInfo.fetchHistory(Symbol, "BSE");
		// 		// collection = db.collection(`${Symbol}.BSE`);
		// 		// await collection.createIndex({ Date: 1 }, { unique: true });
		// 		// await collection.insertMany(data, { ordered: false });
		// 		await spawn("python3", ["./src/py/yahooFinance.py", `${Symbol}.BO`]);
		// 	}
		// 	await require("fs").appendFile(
		// 		"./errorlogs.json",
		// 		`${Symbol} Done\n`,
		// 		(err) => {
		// 			if (err) console.log("Error writing file:", err);
		// 		}
		// 	);
		// });
	},
	updateHistory: async (Symbol) => {
		const cmd = "python3";
		const comOptions = "./src/py/updateHistory.py";
		const params = [Symbol];
		const options = { stdio: ["ignore", "ignore", "pipe"] };
		//const options = undefined;
		const code = await spawnProcess(cmd, [comOptions, ...params], options);
		if (code) console.log(`Done ${Symbol} code ${code}`);
	},
	updateHistoryALL: async () => {
		let Symbols = await module.exports.getAllSymbols();
		Symbols = Symbols.slice(0, 100);
		await Ploop(Symbols, 10, async (Symbol) => {
			await module.exports.updateHistory(Symbol);
		});
	},
	update: async (colName, data, index, callback) => {
		await DBHandler.connect();
		const db = DBHandler.get();
		const collection = db.collection(colName);
		try {
			await collection.createIndex(...index);
			await Promise.all(data.map(callback));
			console.log(`${colName} Collection Updated`);
		} catch (err) {
			console.log(err);
		} finally {
			await DBHandler.close();
		}
	},
};
