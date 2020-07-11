const Security = require("./Security");
const csv = require("csvtojson");
class FetchEquityInfo {
	constructor(
		BSEurl = `https://www.bseindia.com/corporates/List_Scrips.aspx`,
		NSEurl = `https://archives.nseindia.com/content/equities/EQUITY_L.csv`
	) {
		this.BSEurl = BSEurl;
		this.NSEurl = NSEurl;
		this.Securities = new Map();
		this.testSymbols = [
			"M&M",
			"CASTROLIND",
			"TATASTEEL",
			"RELIANCE",
			"BOMDYEING",
			// "HINDUNILVR",
			// "ITC",
			// "TATAMOTORS",
			// "CENTURYTEX",
			// "TATACHEM",
		];
	}

	async getFromNSE(test = 0) {
		try {
			//const res = await this.getData(this.NSEurl);
			// const data = await csv({ output: "json" }).fromString(res.data);
			const data = await csv().fromFile("src/assets/nseEquity.csv");
			data.forEach((val) => {
				const name = val["NAME OF COMPANY"];
				const id = val["SYMBOL"];
				if (test == 1 && this.testSymbols.includes(id) == false) return;
				const dol = val["DATE OF LISTING"];
				const isin = val["ISIN NUMBER"];
				this.Securities.set(id, new Security(id, name, isin, dol, true));
			});
		} catch (err) {
			console.log(err);
		}
	}
	async getFromBSE(test = 0) {
		try {
			//const res = await this.getData(this.BSEurl);
			// const data = await csv({ output: "json" }).fromString(res.data);
			const data = await csv().fromFile("src/assets/bseEquity.csv");
			data.forEach((val) => {
				const name = val["Security Name"];
				const id = val["Security Id"];
				if (test == 1 && this.testSymbols.includes(id) == false) return;
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
	async fetchMeta(test = 0) {
		await this.getFromNSE(test);
		await this.getFromBSE(test);
	}
}
module.exports = new FetchEquityInfo();
