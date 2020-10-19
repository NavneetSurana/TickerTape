const client = require("../db/DBHandler");
const Info = require("../js/FetchEquityInfo");
const conf = require("../js/config");
const fspromises = require("fs").promises;
const {
	spawnProcess,
	execProcess,
	getFmtDate,
	readFile,
	writeFile,
} = require("../js/utility");
const { backupPath } = require("../js/config");
const Ploop = require("async").eachLimit;

module.exports = {
	get: async (colName, query, projection, callback = undefined) => {
		const DBHandler = new client();
		await DBHandler.connect(conf.tickerTapeDB);
		const db = DBHandler.get();
		const collection = db.collection(colName);
		const rawData = await collection.find(query).project(projection).toArray();
		await DBHandler.close();
		//let data = callback ? rawData.map(callback) : rawData;
		return rawData;
	},
	getAllSymbols: async () => {
		const colName = "EquityMeta";
		const query = {};
		const projection = {
			Symbol: 1,
			"Listed In NSE": 1,
			"Listed In BSE": 1,
			_id: 0,
		};
		const rawSecData = await module.exports.get(colName, query, projection);
		let Symbols = [];
		rawSecData.map((sec) => {
			const nseFlag = sec["Listed In NSE"];
			const bseFlag = sec["Listed In BSE"];
			const Symbol = sec["Symbol"];
			let tic = [];
			if (nseFlag) Symbols.push(`${Symbol}.NS`);
			if (bseFlag) Symbols.push(`${Symbol}.BO`);
		});
		return Symbols;
	},
	insertEquityMeta: async (test = 0) => {
		await Info.fetchMeta(test);
		const DBHandler = new client();
		await DBHandler.connect(conf.tickerTapeDB);
		const db = DBHandler.get();
		const collection = db.collection("EquityMeta");
		const securities = Array.from(Info.Securities, ([key, val]) =>
			val.getDetails()
		);
		try {
			await collection.createIndex({ Symbol: 1 }, { unique: true });
			await Ploop(securities, 10, async (security) => {
				const res = await collection.updateOne(
					{ Symbol: security.Symbol },
					{
						$setOnInsert: Object.assign(security, {
							"Last Updated": new Date(),
						}),
					},
					{ upsert: true }
				);
			});
		} catch (err) {
			console.log(err);
		} finally {
			await DBHandler.close();
		}
	},
	updateEquityFlagInfo: async () => {
		const DBHandler = new client();
		await DBHandler.connect(conf.tickerTapeDB);
		const db = DBHandler.get();
		const collection = db.collection("EquityMeta");
		const currCollectionList = (await db.listCollections().toArray()).map(
			(val) => val.name
		);
		const symbolMap = new Map();
		const tickers = (
			await collection.find({}).project({ _id: 0, Symbol: 1 }).toArray()
		).map((val) => val.Symbol);
		tickers.forEach((symbol) => symbolMap.set(symbol, { BSE: 0, NSE: 0 }));
		currCollectionList.forEach((val) => {
			if (val != "EquityMeta") {
				const symbol = val.slice(0, val.length - 4);
				const ext = val.slice(symbol.length + 1, val.length);
				symbolMap.get(symbol)[ext] = 1;
			}
		});
		await Ploop(tickers, 10, async (symbol) => {
			await collection.updateOne(
				{ Symbol: symbol },
				{
					$set: {
						"Listed In NSE": symbolMap.get(symbol)["NSE"],
						"Listed In BSE": symbolMap.get(symbol)["BSE"],
						"Last Updated": new Date(),
					},
				},
				{ upsert: true }
			);
		});
		await DBHandler.close();
	},
	updateHistory: async (Symbol) => {
		const cmd = "python3";
		const comOptions = "./src/py/updateHistory.py";
		const params = [Symbol];
		const options = { stdio: ["ignore", "pipe", "pipe"] };
		const code = await spawnProcess(cmd, [comOptions, ...params], options);
		if (code) console.log(`Done ${Symbol} code ${code}`);
	},
	updateHistoryALL: async () => {
		let Symbols = await module.exports.getAllSymbols();
		let tot=0;
		await Ploop(Symbols, 10, async (Symbol) => {
			await module.exports.updateHistory(Symbol);
			tot+=1;
			console.log(`tot = ${tot}`);
		});
	},

	createBackup: async () => {
		const res = await execProcess(`ls ${backupPath}`);
		let curBackups = [];
		if (res != "") curBackups = res.trim().split("\n");
		const date = getFmtDate();
		const dirName = `TT-${date}`;
		if (curBackups.length > 0 && curBackups[curBackups.length - 1] == dirName) {
			return 0;
		} else {
			await fspromises.mkdir(`${conf.backupPath}/${dirName}`, {
				recursive: true,
			});
			const args = [
				"--db",
				`${conf.dbName}`,
				"--username",
				`${conf.user}`,
				"--password",
				`${conf.pass}`,
				"--authenticationDatabase",
				`${conf.authDb}`,
				"--out",
				`${conf.backupPath}/${dirName}`,
				"2>",
				`${conf.backupPath}/${dirName}/logs.txt`,
			];
			cmd = "mongodump";
			const options = { stdio: ["ignore", "pipe", "pipe"], shell: true };
			const code = await spawnProcess(cmd, args, options);
			if (code == 0) {
				await Ploop(curBackups, 10, async (file) => {
					await execProcess(`rm -rf ${backupPath}/${file}`);
				});
			} else {
				await execProcess(`rm -rf ${backupPath}/${dirName}`);
			}
			return code;
		}
	},
	fetchHistory: async (Symbol) => {
		const cmd = "python3";
		const comOptions = "./src/py/fetchHistory.py";
		const params = [Symbol];
		const options = { stdio: ["ignore", "pipe", "pipe"] };
		const code = await spawnProcess(cmd, [comOptions, ...params], options);
		if (code) console.log(`Done ${Symbol} code ${code}`);
	},
	fetchHistoryALL: async () => {
		let Symbols = await module.exports.getAllSymbols();
		await Ploop(Symbols, 10, async (Symbol) => {
			await module.exports.fetchHistory(Symbol);
		});
	},
	createTestDB: async () => {
		await module.exports.insertEquityMeta(1);
		await module.exports.fetchHistoryALL();
	},
};
