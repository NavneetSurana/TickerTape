const csv = require("csvtojson");
const { getData } = require("./utility");
const DBHandler = require("./DBHandler");
const tickerTapeDB = require("./tickerTapeDB");
const FetchEquityInfo = require("./FetchEquityInfo");
async function f() {
	let strtTime=Date.now()
	await tickerTapeDB.updateHistoryALL();
	console.log(`Done in ${(Date.now()-strtTime)/1000} sec`);
}
f();
// async function f() {
// 	const res = await getData(
// 		`https://query1.finance.yahoo.com/v7/finance/download/RELIANCE.NS?period1=820454400&period2=1591920000&interval=1d&events=history`
// 	);
// 	const data = await csv({ output: "json" }).fromString(res.data);
// 	const finalData = data.map((val) => {
// 		val.Date = new Date(`${val.Date} 00:00:00 UTC`);
// 		return val;
// 	});
// 	await DBHandler.connect();
// 	const db = DBHandler.get();
// 	const collection = db.collection("RELIANCE.NSE");
// 	await collection.createIndex({ Date: 1 }, { unique: true });
// 	await collection.insertMany(finalData, { ordered: false });
// 	await DBHandler.close();
// }
// f();

// const DBHandler = require("./DBHandler");
// const tickerTapeDB = require("./tickerTapeDB");
// //const { url } = require("./config");
// async function f() {
// 	const query = {};
// 	const projection = {
// 		Symbol: 1,
// 		"Listed In NSE": 1,
// 		"Listed In BSE": 1,
// 		_id: 0,
// 	};
// 	const callback = (val) => {
// 		const urls = new Array();
// 		const Symbol = val["Symbol"];
// 		const start = new Date(`1-Jan-1800 UTC`).getTime() / 1000;
// 		let end = new Date();
// 		end.setUTCHours(00, 00, 00, 000);
// 		end = end.getTime() / 1000;
// 		if (val["Listed In BSE"]) {
// 			urls.push({
// 				collection: `${Symbol}.BSE`,
// 				url: `https://query1.finance.yahoo.com/v7/finance/download/${Symbol}.BO?period1=${start}&period2=${new Date()}&interval=1d&events=history`,
// 			});
// 		}
// 		if (val["Listed In NSE"]) {
// 			urls.push({
// 				collection: `${Symbol}.NSE`,
// 				url: `https://query1.finance.yahoo.com/v7/finance/download/${Symbol}.BO?period1=${start}&period2=${end}&interval=1d&events=history`,
// 			});
// 		}
// 		return urls;
// 	};
// 	const rawData =await tickerTapeDB.get(
// 		"EquityInfo",
// 		query,
// 		projection,
// 		callback
// 	);
// 	const data=rawData.flat();

// }
// f();

// // const start = new Date(`1-Jan-1800 UTC`).getTime()/1000;
// // let end=new Date();
// // end.setUTCHours(00,00,00,000);
// // end=end.getTime()/1000;
// // //const end=new Date()
// // console.log(end);
