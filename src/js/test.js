// const axios = require("axios");
// const csv = require("csvtojson");
// async function fetchHistoricalData(url) {
// 	// try {
// 	// 	const res = await axios(
// 	// 		"https://query1.finance.yahoo.com/v7/finance/download/RELIANCE.NS?period1=820454400&period2=1591660800&interval=1d&events=history"
// 	//    );
// 	//    console.log(res.data);
// 	// } catch (err) {
// 	// 	console.log(err);
// 	// }
// 	const res = await axios.get(
// 		"https://query1.finance.yahoo.com/v7/finance/download/RELIANCE.NS?period1=820454400&period2=1591660800&interval=1d&events=history"
// 	);
// 	const data = await csv({ output: "json" }).fromString(res.data);
// 	console.log(data);
// }

// fetchHistoricalData(undefined);
// const a= new Date('1-Jan-1996, UTC');
// console.log(a.getTime())
// //1591574400

// import FetchSequrityData  from "./fetchSecurityData";

const FetchSequrityInfo  = require("./fetchSecurityInfo");

const a=new FetchSequrityData();
a.getFromNSE();
a.getFromBSE();
// const Security = require("./Security.js");
// a = new Map();
// a.set("a", new Security(1, 1, 1, 1));
// const p = a.get("a");
// p.setNSEFlag();
// console.log(a);
