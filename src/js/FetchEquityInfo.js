const Security = require("./Security.js");
const csv = require("csvtojson");
const tickerTapeDB = require("./tickerTapeDB");
const { getData } = require("./utility");
class FetchEquityInfo {
	constructor(
		BSEurl = `https://www.bseindia.com/corporates/List_Scrips.aspx`,
		NSEurl = `https://archives.nseindia.com/content/equities/EQUITY_L.csv`
	) {
		this.BSEurl = BSEurl;
		this.NSEurl = NSEurl;
		this.Securities = new Map();
		this.__err = new Array();
	}

	async getFromNSE() {
		try {
			//const res = await this.getData(this.NSEurl);
			// const data = await csv({ output: "json" }).fromString(res.data);
			const data = await csv().fromFile("src/assets/nseEquity.csv");
			data.forEach((val) => {
				const name = val["NAME OF COMPANY"];
				const id = val["SYMBOL"];
				const dol = val["DATE OF LISTING"];
				const isin = val["ISIN NUMBER"];
				this.Securities.set(id, new Security(id, name, isin, dol, true));
			});
		} catch (err) {
			console.log(err);
		}
	}
	async getFromBSE() {
		try {
			//const res = await this.getData(this.BSEurl);
			// const data = await csv({ output: "json" }).fromString(res.data);
			const data = await csv().fromFile("src/assets/bseEquity.csv");
			data.forEach((val) => {
				const name = val["Security Name"];
				const id = val["Security Id"];
				const dol = undefined;
				const isin = val["ISIN No"];
				if (this.Securities.has(id) == false) {
					this.Securities.set(
						id,
						new Security(id, name, isin, dol, false, true)
					);
				} else {
					this.Securities.get(id).setBSEFlag();
				}
			});
		} catch (err) {
			console.log(err);
		}
	}
	async fetchMeta() {
		await this.getFromNSE();
		await this.getFromBSE();
	}
	async getCookies(Symbol, excngName) {
		const url = `https://finance.yahoo.com/quote/${Symbol}${excngName}/history`;
		const res = await getData(url);
		//   txt = r.content
		//   cookie = r.cookies["B"]
		//   pattern = re.compile('.*"CrumbStore":\{"crumb":"(?P<crumb>[^"]+)"\}')

		//   for line in txt.splitlines():
		//       m = pattern.match(line.decode("utf-8"))
		//       if m is not None:
		//           crumb = m.groupdict()["crumb"]
		//           crumb = crumb.replace(u"\\u002F", "/")
	}
	async fetchHistory(Symbol, excngName) {
		// let url;
		// const start = new Date(`1-Jan-2020 UTC`).getTime() / 1000;
		// let end = new Date();
		// end.setUTCHours(0, 0, 0, 0);
		// end = end.getTime() / 1000;
		// if (excngName === "NSE") {
		// 	url = `https://query1.finance.yahoo.com/v7/finance/download/${Symbol}.NS?period1=${start}&period2=${end}&interval=1d&events=history&crumb=${crumb}`;
		// } else if (excngName === "BSE") {
		// 	url = `https://query1.finance.yahoo.com/v7/finance/download/${Symbol}.BO?period1=${start}&period2=${end}&interval=1d&events=history&crumb=${crumb}`;
		// }

		// const res = await getData(url);
		// let data = [];
		// if (res.status === 200) {
		// 	console.log(`${Symbol}.${excngName}: ${res.status}`);
		// 	const rawData = await csv({ output: "json" }).fromString(res.data);
		// 	data = rawData.map((val) => {
		// 		val.Date = new Date(`${val.Date} 00:00:00 UTC`);
		// 	});
		// }
		// return data;
		const start = "1800-01-01";
		const end = "2020-06-13";
		let symbol;
		if (excngName === "NSE") {
			symbol = `${Symbol}.NS`;
		} else if (excngName === "BSE") {
			symbol = `${Symbol}.BO`;
		}

		const res = await yahooFinance.historical({
			symbol: symbol,
			from: start,
			to: end,
			function(err, quotes) {
				if (err) return [];
				return quotes;
			},
		});
		const data = res.map((val) => {
			delete val["symbol"];
			return val;
		});
		//return data;
		console.log(data);
	}
}
module.exports = new FetchEquityInfo();
